const data = {
    users: [
        {
            name: "admin",
            email: "admin@example.com",
            password: "admin",
        },
        {
            name: "venki",
            email: "venki@gmail.com",
            password: "1234",
        }
    ],
    appName: "CryptoStego",
    subTitle: "A secure data transfer over Internet using image crypto-steganography",
    aboutHeading: "Combining both Cryptography and Steganography",
    aboutContent: `
        CryptoStego is a method aimed at amalgamating both the cryptography and steganography methods for a better information security. During data transfer the confidentiality and privacy should be maintained. The primary purpose of this tool is to build up a new method of hiding secret text messages inside an image, by combining both cryptography and steganography concepts. So a new algorithm is proposed and implemented to achieve this.
        `, 
    encodingContent: `
        Encoding is a function which takes the cover image, message to be encoded and the secret key as input. First the message is encrypted using AES-256 Algorithm using the secret key which is hashed with SHA-256 hash function. Then this encrypted message is encoded inside the cover image using LSB substitution method.
        `,
    encodingNoteContent: `
        Note: You can either provide the recipient Email ID so that they can decode the image using the Stego Image ID and Secret Key received through their mail or save the Stego Image and send the recipient through any third party file transfer platform (While transferring the image, image quality shouldn't be lost).
        `,
    decodingContent: `
        Decoding is a function which takes the stego image id, and the secret key as input. The stego image corresponding to the stego image id is retrieved from the database and the encrypted message encoded inside the image is now decoded using LSB decryption method which is then decrypted using AES-256 Algorithm.
    `,
    decodingNoteContent: `
        Note: You can decode the message either by explicitly uploading the stego image or by using the Stego Image ID and Secret Key which is received through the mail.
    `,
}

export default data;