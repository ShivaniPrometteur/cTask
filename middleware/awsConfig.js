const aws = require("aws-sdk")
const userContoller = require('../controller/usercontroller')


aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",                     //aws creds
        secretAccessKey: "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",    //aws creds
        region: "ap-south-1"
    }
)

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        //this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws
        //  await uploadFile(files[0])
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", // HERE
            Key: "profilePic" + file.originalname, // HERE shiv/img.jpg
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }

            console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location) // HERE
        }
        )
    }
    )
}


module.exports.uploadFile=uploadFile