import React from 'react';

export class App extends React.Component {
	constructor(param) {
		super(param);

		this.state = {
			buyItems: ['milk', 'bread', 'fruit'],
			message: ''
		}

	}

	addItem(event) {
		event.preventDefault();
		const { buyItems } = this.state;
		const newItem = this.newItem.value;

		// returns true or false
		const isOnTheList = buyItems.includes(newItem);

		if (isOnTheList) {
			this.setState({
				message: 'This item is already on the list.'
			})
		} else {
			if (newItem !== '') {
				this.setState({
					buyItems: [...this.state.buyItems, newItem],
					message: ''
				})

			}
		}

		this.addForm.reset();
	}

	removeItem(item) {
		const newBuyItems = this.state.buyItems.filter(buyItem => {
			return buyItem !== item;
		});

		this.setState({
			buyItems: newBuyItems
		})

		if (newBuyItems.length === 0) {
			this.setState({
				message: 'No items on your list, add some.'
			})
		}

	}

	clearAll() {
		this.setState({
			buyItems: [],
			message: 'No items on your list, add some.'
		})
	}

	render() {
		const { buyItems, message } = this.state;
		return (
			<div>
				<header>
					{/* <img src={image} /> */}
					<h1>Shopping List</h1>

					<form ref={(input) => { this.addForm = input }} className="form-inline" onSubmit={(event) => { this.addItem(event) }}>
						<div className="form-group">
							<label htmlFor="newItemInput" className="sr-only">Add new Item</label>
							<input ref={(input) => { this.newItem = input }} type="text" placeholder="Bread" className="form-controll" />
						</div>
						<button type="submit" className="btn btn-primary">Add</button>
					</form>

				</header>
				<div className="content">
					{
						(message !== '' || buyItems.length === 0) && <p className="message text-danger">{message}</p>
					}
					{
						buyItems.length > 0 &&
						<table className="table">
							<caption>Shopping List</caption>
							<thead>
								<tr>
									<th>#</th>
									<th>Item</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									buyItems.map(item => {
										return (
											<tr key={item}>
												<th scope="row">1</th>
												<td>{item}</td>
												<button onClick={(event) => this.removeItem(item)} type="button" className="btn btn-default btn-sm">
													Remove
											</button>
											</tr>
										)
									})
								}
							</tbody>
							<tfoot>
								<tr>
									<td colSpan="2">&nbsp;</td>
									<td className="text-right">
										<button onClick={(event) => this.clearAll()} className="btn btn-default btn-sm">Clear list</button>
									</td>
								</tr>
							</tfoot>
						</table>
					}
				</div>
			</div>
		)
	}
}