export class HeaderEntry {
	// The name of the header to be shown in the table
	public headerLabel: string;
	// The name of the corresponding object property
	public propName: string;

	constructor(head: string, prop: string) {
		this.headerLabel = head;
		this.propName = prop;
	}
}
export class TableInput {
	// Array of header entries to show in the table
	public headers: Array<HeaderEntry>;
	// Array of items to show in the table (only the properties included
	// in headers will be shown)
	public items: Array<any>;

	constructor(headers: Array<HeaderEntry>, objects: Array<any>) {
		this.headers = headers;
		this.items = objects;
	}
}
