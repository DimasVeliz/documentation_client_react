import axios from 'axios'


export default {
    getData: () =>
        axios({
            'method': 'GET',
            'url': 'http://localhost:8081/api/documents/metadocuments',
            'headers': {
                'content-type': 'application/json'
            }
        }),
    getDocument: (uuid) =>
        axios({
            'method': 'GET',
            'url': 'http://localhost:8081/api/documents/download',
            'responseType': 'blob',
            'headers': {
                'accept': 'application/octet-stream'

            }, 'params': {
                'documentUUID': uuid,
            }
        }),
    postData: (selectedFile,name,year,owner) =>
        axios({
            'method': 'POST',
            'url': 'http://localhost:8081/api/documents',
            'headers': {
                'content-type': 'application/json'

            }, 'data': {
                "name": name,
                "year": year,
                "owner": owner,
                "fileInfo": {
                    "mime": "application/pdf",
                    "data": selectedFile

                }
            }
        })

}