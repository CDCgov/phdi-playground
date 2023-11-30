export class MockWebSocket { 
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.sampleData = "{\"steps\": [{\"service\": \"validation\", \"endpoint\": \"/validate\"}, {\"service\": \"fhir_converter\", \"endpoint\": \"/convert-to-fhir\"}, {\"service\": \"ingestion\", \"endpoint\": \"/fhir/harmonization/standardization/standardize_names\"}, {\"service\": \"ingestion\", \"endpoint\": \"/fhir/harmonization/standardization/standardize_phones\"}, {\"service\": \"ingestion\", \"endpoint\": \"/fhir/harmonization/standardization/standardize_dob\"}, {\"service\": \"message_parser\", \"endpoint\": \"/parse_message\"}], \"validate\": {\"status_code\": 200, \"Message\": \"OK\"}, \"convert-to-fhir\": {\"status_code\": 200, \"Message\": \"OK\"}, \"standardize_names\": {\"status_code\": 200, \"Message\": \"OK\"}, \"standardize_phones\": {\"status_code\": 200, \"Message\": \"OK\"}, \"standardize_dob\": {\"status_code\": 200, \"Message\": \"OK\"}}"
  }

  open() {
    this.readyState = WebSocket.OPEN;
    if (this.onopen) {
      this.onopen();
    }
  }

  send(data) {
    if (this.onmessage) {
      this.onmessage({ data: this.sampleData });
    }
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose();
    }
  }
}
