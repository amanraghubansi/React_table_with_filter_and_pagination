var React = require('react');
var ReactDOM = require('react-dom');


var SearchableTable=React.createClass({
	getInitialState:function(){
		return{
			filteredData:this.props.tableData
		}
	},
	doSearch:function(val){
		val=val.toLowerCase();
		var queryData=[],
			filteredData=this.props.tableData;
		if(val == ""){
			queryData=filteredData;
		}
		else{
			for(var i in filteredData){
				if(filteredData[i].paymentId.toLowerCase().indexOf(val)!=-1 || filteredData[i].merchantName.toLowerCase().indexOf(val)!=-1 ||
					filteredData[i].merchantTransactionId.toLowerCase().indexOf(val)!=-1 || filteredData[i].amountLeft.toLowerCase().indexOf(val)!=-1 ||
					filteredData[i].lastStatus.toLowerCase().indexOf(val)!=-1 || filteredData[i].SNo.toLowerCase().indexOf(val)!=-1){
						queryData.push(filteredData[i]);
				}
			}	
		}
		this.setState({
			filteredData:queryData	
		})
	},
	render:function(){
		var tableData=this.state.filteredData;
		return(
			<div className='container'>
				<div className='row'>
					<SearchBar doSearch={this.doSearch}/>
					<Pagination len={tableData.length} pageSize={this.props.pageSize} tableData={tableData}/>
				</div>
			</div>
		)
	}
});


var SearchBar=React.createClass({
	doSearch:function(e){
		this.props.doSearch(e.target.value);
	},
	render:function(){
		return(
			<div className='form-group'>
				<label htmlFor="searchtext">Search text to filter results  </label>
				<input type='text' placeholder='Enter Merchant Name,Order ID,Payment ID,Amount,Status' id='searchtext' className='form-control' onChange={this.doSearch} />
			</div>
			
		)
	}
});

var Pagination=React.createClass({
	getInitialState:function(){
		return{
			currentPage:1
		}
	},
	getNum:function(){
		console.log(this.props.len)
		numPages=Math.floor(this.props.len/this.props.pageSize)
		if(this.props.len % this.props.pageSize > 0){
			numPages++;
		}
		return numPages;
	},
	getPage:function(){
		var start=this.props.pageSize * (this.state.currentPage -1),
			end= start + this.props.pageSize;
		var obj={
			currentPage : this.state.currentPage,
			numPages :this.getNum(),
			data:this.props.tableData.slice(start,end),
			handleClick: function(pageNum) {
			    return function() { this.handlePageChange(pageNum) }.bind(this)
			}.bind(this)
		}
		console.log(obj);
		return obj;
	},
	handlePageChange:function(pageNo){
		this.setState({currentPage:pageNo});
	},
	render:function(){
		var page=this.getPage(),PagButtons=[];
		if(page.currentPage > 1){
			if(page.currentPage > 2){

				PagButtons.push(<span className="PagButtons" data-val={'1'} onClick={page.handleClick(1)}>«</span>)
      			PagButtons.push(' ')
			}
			PagButtons.push(<span className="PagButtons" data-val={page.currentPage-1} onClick={page.handleClick(page.currentPage-1)}>‹</span>)
      		PagButtons.push(' ')
		}
		
		PagButtons.push(<span className="currentPage">Page {page.currentPage} of {page.numPages}</span>)
		if (page.currentPage < page.numPages) {
				PagButtons.push(' ')
				PagButtons.push(<span className="PagButtons" data-val={page.currentPage+1} onClick={page.handleClick(page.currentPage+1)}>›</span>)
				if (page.currentPage < page.numPages - 1) {
					PagButtons.push(' ')
					PagButtons.push(<span className="PagButtons" data-val={(page.numPages)} onClick={page.handleClick(page.numPages)}>»</span>)
				}
		}
		return(
			<div>
				<div className='paginatedDiv'>
					{PagButtons}
				</div>
				<DisplayTable tableData={page.data}/>
			</div>
		)
	}
});


var DisplayTable=React.createClass({
	render:function(){
		var data=this.props.tableData;
		return(
				<table className='table table-striped table-bordered table-hover'>
					<thead>
						<tr>
							<th>Serial No</th>
							<th>Date</th>
							<th>Merchant Name</th>
							<th>Order ID</th>
							<th>Payment ID</th>
							<th>Amount</th>
							<th>Payment Status</th>
						</tr>
					</thead>
					<tbody>
						{
							data.map(function(obj){
								return(
									<tr key={obj.paymentId}>
										<td>{obj.SNo}</td>
										<td>{obj.addedOn}</td>
										<td>{obj.merchantName}</td>
										<td>{obj.merchantTransactionId}</td>
										<td>{obj.paymentId}</td>
										<td>{obj.amountLeft}</td>
										<td>{obj.lastStatus}</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
		)
	}
});



ReactDOM.render(<SearchableTable tableData={result['content']} pageSize={5}/>,document.getElementById('main'));

