import UploadFile from "../app/upload_file/page";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Upload File", () => {
  it("renders a upload file page", () => {
    render(<UploadFile />);
    expect(screen.getByText('Input accepts a single file')).toBeInTheDocument();
  });
});

describe('UploadFile Component', () => {

  it('should handle form submission', async () => {
    // Create a function to mimic a FileList object
    function createFileList(array) {
      return {
        length: array.length,
        item(index) {
          return array[index] || null;
        },
      };
    }
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );
    const { getByText, queryByTestId } = render(<UploadFile />);

    const fileInput = queryByTestId('file-input-input')
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileList = createFileList([file]);

    fireEvent.change(fileInput, {
      target: { files: fileList },
    })

    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);

    // Assert that the handleSubmit function has been called
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/process', {
      method: 'POST',
      body: expect.any(FormData),
    });

    // Reset fetch mock
    global.fetch.mockRestore();
  });
});
