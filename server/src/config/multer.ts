import multer from 'multer'
//esta dependência é natia do node
import path from 'path'
//usar uma hash para evitar ter nomes de arquivos duplicados
import crypto from 'crypto'

export default {
    storage: multer.diskStorage({
        //para informar onde vão os arquivos enviados pelo usuário 
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback){
            //(6) informar qntos bytes de caracteres aleatórios quer gerar e transformar em string hexdeciaml
            const hash = crypto.randomBytes(6).toString('hex')

            const filename = `${hash}-${file.originalname}`
//p1 caso de erro p2 caso consiga gerar o arquivo passa o nome
            callback(null, filename)
        }
    })
} 