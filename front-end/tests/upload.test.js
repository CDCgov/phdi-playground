import UploadFile from "../app/upload_file/page";
import * as utils from "../app/upload_file/utils"
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataProvider } from '../utils/DataContext';
import { MockWebSocket } from "./mockWebSocket";

import { act } from "react-dom/test-utils";

let wsInstance = new MockWebSocket('ws://example.com');
jest.mock("../app/upload_file/utils", () => ({
  ...(jest.requireActual('../app/upload_file/utils')),
  createWebSocket: jest.fn(() => {
    return wsInstance
  })
}));


jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: jest.fn(), // Add the push method
    };
  }
}));

const createFileList = (array) => {
  return {
    length: array.length,
    item(index) {
      return array[index] || null;
    },
  };
}



describe("Upload File", () => {
  it("renders a upload file page", () => {
    render(
      <DataProvider>
        <UploadFile />
      </DataProvider>
    );
    expect(screen.getByText('Upload your eCR')).toBeInTheDocument();
  });

});

describe('UploadFile Component', () => {

  it('should handle form submission', async () => {
    // Create a function to mimic a FileList object
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );


    const sendSpy = jest.spyOn(wsInstance, 'send');

    const { getByText, queryByTestId } = await act(async () => render
      (
        <DataProvider>
          <UploadFile />
        </DataProvider>
      )
    );
    const fileInput = queryByTestId('file-input-input')
    const file = new File(['{"test": "content"}'], 'test.zip', { type: 'text/json' });
    const fileList = createFileList([file]);

    await act(async () => {
      fireEvent.change(fileInput, {
        target: { files: fileList },
      });
    });


    const uploadButton = getByText('Continue');
    await act(async () => {
      fireEvent.click(uploadButton);
    });

    expect(sendSpy).toHaveBeenCalledWith(file);
    expect(screen.getByText('Validating data fields')).toBeInTheDocument();
    expect(screen.getByText('Converting to FHIR')).toBeInTheDocument();

    // Reset fetch mock
    global.fetch.mockRestore();
    sendSpy.mockRestore();
  });

  it('should reject files that are too big', async () => {
    // Create a function to mimic a FileList object
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );


    const sendSpy = jest.spyOn(wsInstance, 'send');

    const { getByText, queryByTestId } = await act(async () => render
      (
        <DataProvider>
          <UploadFile />
        </DataProvider>
      )
    );
    const fileInput = queryByTestId('file-input-input')
    const file = new File(['{"test": "content"}'], 'test.zip', { type: 'text/json' });
    Object.defineProperty(file, 'size', { value: 1000000000 + 1 })
    const fileList = createFileList([file]);

    await act(async () => {
      fireEvent.change(fileInput, {
        target: { files: fileList },
      });
    });

    expect(screen.getByText('We can only accept .zip files smaller than 1GB')).toBeInTheDocument();

    // Reset fetch mock
    global.fetch.mockRestore();
    sendSpy.mockRestore();
  });

  it('should reject files that are not .zip', async () => {
    // Create a function to mimic a FileList object
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );


    const sendSpy = jest.spyOn(wsInstance, 'send');

    const { getByText, queryByTestId } = await act(async () => render
      (
        <DataProvider>
          <UploadFile />
        </DataProvider>
      )
    );
    const fileInput = queryByTestId('file-input-input')
    const file = new File(['{"test": "content"}'], 'test.json', { type: 'text/json' });
    const fileList = createFileList([file]);

    await act(async () => {
      fireEvent.change(fileInput, {
        target: { files: fileList },
      });
    });

    expect(screen.getByText('We can only accept .zip files')).toBeInTheDocument();

    // Reset fetch mock
    global.fetch.mockRestore();
    sendSpy.mockRestore();
  });
});
