import React from 'react'
import api from './api'

const NAME_INPUT_VALUE = "name";
const OWNER_INPUT_VALUE = "owner";
const YEAR_INPUT_VALUE = "year";
const UUID_INPUT_VALUE = "uuid";

const IndexPage = () => {
    // Create state variables
    let [responseData, setResponseData] = React.useState('')
    let [uuid, setInputUuid] = React.useState('')
    let [name, setInputName] = React.useState('')
    let [owner, setInputOwner] = React.useState('')
    let [year, setInputYear] = React.useState('')

    let [selectedFile, setSelectedFile] = React.useState(null);
    let [responseFromUpload, setResponseFromUpload] = React.useState('')

    // fetches data
    const fetchData = (e) => {
        e.preventDefault()

        api.getData()
            .then((response) => {
                setResponseData(response.data)
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //downloads a document
    const downloadDocument = (e) => {
        e.preventDefault()

        api.getDocument(uuid)
            .then((response) => {
                const href = URL.createObjectURL(response.data);

                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', 'file'); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);

                console.log("Downloaded the document")
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //uploads a document
    const sendDocument = async (e) => {
        e.preventDefault()
        console.log("here");
        let b64File= await toBase64(selectedFile)
        let cleaned= b64File.replace("data:application/pdf;base64,","");
        api.postData(cleaned, name, year, owner)
            .then((response) => {
                let metadocumentData = drawMetadata();
                setResponseFromUpload(metadocumentData)

                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    //hanlders
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };



    const updateInputValue = (evt, inputSelector) => {
        const val = evt.target.value;
        switch (inputSelector) {
            case NAME_INPUT_VALUE:
                setInputName(val)
                break;
            case YEAR_INPUT_VALUE:
                setInputYear(val)
                break;
            case OWNER_INPUT_VALUE:
                setInputOwner(val)
                break;
            case UUID_INPUT_VALUE:
                setInputUuid(val)
                break;
            default:
                break;
        }

        console.log(val);
    }
    const drawMetadata = () =>
    (<div>
        <h3>SuccesfullyUploaded</h3>
    </div>)



    return (
        <div>
            <h1>Stored Documents</h1>
            <button onClick={(e) => fetchData(e)} type='button'>Get Documents Metadata</button>

            <div>
                <table>
                    <tr>
                        <th>Document Name</th>
                        <th>Owner</th>
                        <th>Year</th>
                        <th>uuid</th>
                    </tr>

                    {responseData && responseData.map(metadocument => {
                        return (<tr>
                            <td>{metadocument.name}</td>
                            <td>{metadocument.owner}</td>
                            <td>{metadocument.year}</td>
                            <td>{metadocument.uuid}</td>
                        </tr>)
                    })}
                </table>
            </div>
            <div>
                <h2>Download Section</h2>
                <button onClick={(e) => downloadDocument(e)} type='button'>Click to Download a Document</button>
                <input value={uuid} onChange={(evt) => updateInputValue(evt, UUID_INPUT_VALUE)} />

            </div>

            <div>
                <h2>Upload Section</h2>
                <input value={name} onChange={(evt) => updateInputValue(evt, NAME_INPUT_VALUE)} placeholder={"document name"} />
                <input value={year} onChange={(evt) => updateInputValue(evt, YEAR_INPUT_VALUE)} placeholder={"year"} />
                <input value={owner} onChange={(evt) => updateInputValue(evt, OWNER_INPUT_VALUE)} placeholder={"owner"} />
                <input type="file" onChange={handleFileChange} />
                <br />
                <button onClick={sendDocument}>Upload Info to the server</button>
            </div>
            <div>
                <br></br>
                {responseFromUpload}
            </div>

        </div>
    )
}

export default IndexPage