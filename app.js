require('dotenv').config()

const path = require('path')
const NodeMediaServer = require("node-media-server")

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