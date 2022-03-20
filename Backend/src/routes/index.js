const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const crypto = require('crypto');
const key = Buffer.from('En4bL3Buff3rK3yFr0OmSeguridad!nf', 'utf8'); //La llave debe contener 32 caracteres para el cifrado aes256
let passwordEncripted;

router.get('/', (req, res) => {
	res.send('Backend Funcionando ⚙')
});

router.post('/register', async (req, res) => {
	const { userName, password, name, apellidoPaterno, apellidoMaterno, phoneNum, addressCalle, addressColonia, codPostal } = req.body;
	try {
		let algorithm = 'aes256';
		let inputEncoding = 'utf8';
		let outputEncoding = 'hex';
		let ivlength = 16  // AES blocksize initialization
		let iv = crypto.randomBytes(ivlength);
		let text = password;
		console.log(`Ciphering "${text}" with key "${key}" using "${algorithm}"`);
		let cipher = crypto.createCipheriv(algorithm, key, iv);
		let ciphered = cipher.update(text, inputEncoding, outputEncoding);
		ciphered += cipher.final(outputEncoding);
		let ciphertext = iv.toString(outputEncoding) + ':' + ciphered
		passwordEncripted = ciphertext;
	} catch (error) {
		console.log(error);
	}
	const newUser = new User({ userName, passwordEncripted, name, apellidoPaterno, apellidoMaterno, phoneNum, addressCalle, addressColonia, codPostal });
	let userInUse = await User.findOne({ userName })
	console.log(`The user in the databse is ${userInUse}`)
	console.log(newUser);
	if (userInUse) {
		return res.status(401).send('El Usuario ya existe');
	} else {
		await newUser.save();
		const token = await jwt.sign({ _id: newUser._id }, 'secretkey');
		res.status(200).json({ token });
	}
});


router.post('/login', async (req, res) => {
	try {
		const { userName, password } = req.body;
		const user = await User.findOne({ userName });
		if (!user) return res.status(401).send('El Usuario no existe');

		let ciphertext = user.passwordEncripted
		let algorithm = 'aes256';
		let inputEncoding = 'utf8';
		let outputEncoding = 'hex';
		let text = password;

		passwordEncripted = ciphertext;
		let components = ciphertext.split(":");
		let iv_from_ciphertext = Buffer.from(components.shift(), outputEncoding);
		let decipher = crypto.createDecipheriv(algorithm, key, iv_from_ciphertext);
		let deciphered = decipher.update(
			components.join(":"),
			outputEncoding,
			inputEncoding
		);
		deciphered += decipher.final(inputEncoding);

		try {
			assert.equal(deciphered, text, "Error en la contraseña!");
			const token = jwt.sign({ _id: user._id }, 'secretkey');
			return res.status(200).json({ token });
		} catch (error) {
			return res.status(400).send('Error en la contraseña.'),
				console.log(error);
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
