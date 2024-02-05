import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';

interface Options {
	port: number;
	routes: Router;
	public_path?: string;
}

export class Server {
	public readonly app = express();

	private readonly port: number;
	private readonly routes: Router;
	private readonly publicPath: string;
	private serverListener?: any;

	constructor(options: Options) {
		const { port, routes, public_path = 'public' } = options;
		this.port = port;
		this.publicPath = public_path;
		this.routes = routes;
	}

	async start() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(
			fileUpload({
				limits: { fileSize: 50 * 1024 * 1024 },
			})
		);

		this.app.use(express.static(this.publicPath));

		this.app.use(this.routes);

		this.app.get('*', (req, res) => {
			const indexPath = path.join(
				__dirname + `../../../${this.publicPath}/index.html`
			);
			res.sendFile(indexPath);
		});

		this.serverListener = this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`);
		});
	}

	public close() {
		this.serverListener?.close();
	}
}
