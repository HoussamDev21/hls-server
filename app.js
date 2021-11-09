require('dotenv').config()

const path = require('path')
const NodeMediaServer = require("node-media-server")
const glob = require('glob')
const express = require('express')
const app = express()

const config = {
	rtmp: {
		port: process.env.RTMP_PORT,
		chunk_size: 60000,
		gop_cache: true,
		ping: 30,
		ping_timeout: 60,
	},
	http: {
		port: process.env.HTTP_PORT,
		mediaroot: path.dirname(require.main.filename) + '/media',
		allow_origin: "*",
	},
	trans: {  
		ffmpeg: process.env.FFMPEG_PATH, 
		tasks: [  
			{  
				app: 'live',  
				hls: true,  
				hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]', 
				mp4: true,
				mp4Flags: '[movflags=frag_keyframe+empty_moov]',
				
			}
		]
	}, 
};

var nms = new NodeMediaServer(config)
nms.run()

app.use('/media', express.static(path.join(__dirname, 'media')))
app.get('/archives', async (req, res) => {
	const files = await new Promise((resolve) => {
		glob("media/live/**/*.mp4", (_, files) => {
			resolve(files)
		})
	})	
	res.end(`
		<html>
			<head></head>
			<body style="font-family: monospace; background: #dadada">
				${files.reverse().map(file => `
					<div style="margin-bottom: 50px">
						<div style="margin-bottom: 10px">${file}</div>
						<video src="/${file}" width="300px" controls></video>
					</div>
				`).join('')}
			</body>	
		</html>
	`)
})
app.listen(process.env.EXPRESS_PORT, () => {
    console.log('app started :', process.env.EXPRESS_PORT)
})