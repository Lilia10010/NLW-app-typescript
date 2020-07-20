import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

//se estivesse funcionando os icons, fazer a importação e colocar a tag do icon antes da frase
// import { FiUpload } from 'react-icons/fi'   - <FiUpload />

import './style.css'

interface Props{
    //void é pq não tem retorno
    onFileUploaded: (file: File) => void;
}


const Dropzone: React.FC<Props> = ({onFileUploaded}) => {
    
    //fazer um preview do upload (p1 fazendo a url da img)
    const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    //criando a url
    const fileUrl = URL.createObjectURL(file);
    setSelectedFileUrl(fileUrl)
    onFileUploaded(file)
  }, [onFileUploaded]) //colocar a função aqui como uma depencência
  const {getRootProps, getInputProps} = useDropzone({
      onDrop,
      accept: 'image/*'
    })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {selectedFileUrl
                ? <img src={selectedFileUrl} alt="Point thumbnail" />
                : (
                    <p>
                        
                        Imagem do estabelecimento
                    </p>
                )
            }    
          
     
    </div>
  )
}

export default Dropzone;