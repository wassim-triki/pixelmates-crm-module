import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import Collapse from 'react-bootstrap/Collapse';
import DatePicker from "react-datepicker";

const options = [
    { value: '2', label: 'Published' },
    { value: '3', label: 'Draft' },
    { value: '4', label: 'Trash' },
    { value: '5', label: 'Private' },
    { value: '6', label: 'Pending' }
]

const tableData = [
    {number:"1", title:"Privacy Policy"},
    {number:"2", title:"Contact Us"},
    {number:"3", title:"Price"},
    {number:"4", title:"Blog"},
    {number:"5", title:"Faq"},
    {number:"6", title:"About us"},
    {number:"7", title:"Portfolio"},
    {number:"8", title:"Schedule"},
    {number:"9", title:"Under Maintenance"},
    {number:"10", title:"Comming Soon"},
];

const EmailTemplate = () =>{
    const [open, setOpen] = useState(true);
    const [open2, setOpen2] = useState(true);

    const [data, setData] = useState(
		document.querySelectorAll("#content_wrapper tbody tr")
	);
	const sort = 8;
	const activePag = useRef(0);
	const [test, settest] = useState(0);

	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};
   useEffect(() => {
      setData(document.querySelectorAll("#content_wrapper tbody tr"));
	}, [test]);

  
   activePag.current === 0 && chageData(0, sort);
   let paggination = Array(Math.ceil(data.length / sort))
      .fill()
      .map((_, i) => i + 1);

	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		settest(i);
	};   
	
    const [deleteItem, setDeleteItem] = useState(tableData);
    const handleDelete = ind => {
        setDeleteItem(oldValues => {
          return oldValues.filter((_, i) => i !== ind)
        })
    }
    const [startDate, setStartDate] = useState(new Date());
    return(
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="row page-titles ">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to={"#"}>CMS</Link></li>
                            <li className="breadcrumb-item active"><Link to={"#"}>Email Template</Link></li>                           
                        </ol>
                    </div>
                    <div className="filter cm-content-box box-primary">
                        <div className={`content-title`}>
                            <div className="cpa">
                                <i className="fas fa-filter me-2"></i>Filter
                            </div>
                            <div className="tools">
                                <Link to={"#"} className={`SlideToolHeader ${open ? 'collapse' : 'expand' }`}
                                    onClick={() => setOpen(!open)}
                                >
                                    <i className="fas fa-angle-up"></i>
                                </Link>
                            </div>
                        </div>                      
                        <Collapse in={open}>
                            <div className="cm-content-body form excerpt">
                                <div className="card-body pb-3">
                                    <div className="row">
                                        <div className="col-xl-3 col-xxl-6">
                                            <input type="text" className="form-control mb-xl-0 mb-3" id="exampleFormControlInput1" placeholder="Title" />
                                            
                                        </div>
                                        <div className="col-xl-3 col-xxl-6">                                            
                                            <Select 
                                                isSearchable = {false}
                                                options={options} className="custom-react-select mb-3 mb-xxl-0"
                                            />
                                        </div>
                                        <div className="col-xl-3 col-xxl-6 mb-xxl-0 mb-3">
                                            <div className="input-hasicon mb-sm-0 mb-3">                                            
                                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}  className='form-control '/>
                                                <div className="icon"><i className="far fa-calendar"/></div>
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-xxl-6">
                                            <button className="btn btn-primary me-2" title="Click here to Search" type="button"><i className="fa-sharp fa-solid fa-filter me-1"></i>Filter</button>
                                            <button className="btn btn-danger light" title="Click here to remove filter" type="button">Remove</button>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                        </Collapse>   
                    </div>
                    <div className="mb-3">
                        <ul className="d-flex align-items-center">
                            <li><Link to={"/add-email"} className="btn btn-primary">New Email Template</Link></li>
                        </ul>
                    </div>
                    <div className="filter cm-content-box box-primary mt-5">
                        <div className={`content-title`}>
                            <div className="cpa">
                                <i className="far fa-envelope me-2"></i> Email Template List
                            </div>
                            <div className="tools">
                                <Link to={"#"} className={`SlideToolHeader ${open2 ? 'collapse' : 'expand' }`}
                                     onClick={() => setOpen2(!open2)}
                                >
                                    <i className="fas fa-angle-up"></i>
                                </Link>
                            </div>
                        </div>
                        <Collapse in={open2}>
                            <div className="cm-content-body form excerpt">
                                <div className="card-body py-3">
                                    <div className="table-responsive">
                                        <div id="content_wrapper" className="dataTables_wrapper no-footer">
                                            <table className="table table-responsive-lg table-striped table-condensed flip-content">
                                                <thead>
                                                    <tr>
                                                        <th className='text-black'>S.No</th>
                                                        <th className='text-black'>Title</th>
                                                        <th className='text-black'>Status</th>
                                                        <th className='text-black'>Modified</th>
                                                        <th className="text-end text-black">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {deleteItem.map((item, ind)=>(
                                                        <tr key={ind}>
                                                            <td>{item.number}</td>
                                                            <td>{item.title}</td>
                                                            <td><Link to={"#"}  className=" btn btn-primary btn-sm content-icon status m-0"><i className="fa-solid fa-check"></i> </Link></td>
                                                            <td>18 Feb, 2023</td>
                                                            <td className='text-end'>
                                                                <Link to={"/add-email"} className="btn btn-warning btn-sm content-icon">
                                                                    <i className="fa fa-edit"></i>
                                                                </Link>
                                                                <Link to={"#"} className="btn btn-danger btn-sm content-icon ms-1"
                                                                    onClick={()=>handleDelete(ind)}
                                                                >
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                    Showing {activePag.current * sort + 1} to{" "}
                                                    {data.length > (activePag.current + 1) * sort
                                                        ? (activePag.current + 1) * sort
                                                        : data.length}{" "}
                                                    of {data.length} entries
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        to="/email-template"
                                                        onClick={() =>
                                                        activePag.current > 0 &&
                                                        onClick(activePag.current - 1)
                                                        }
                                                    >
                                                        <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                                                    </Link>
                                                    <span>
                                                        {paggination.map((number, i) => (
                                                        <Link
                                                            key={i}
                                                            to="/email-template"
                                                            className={`paginate_button  ${
                                                                activePag.current === i ? "current" : ""
                                                            } `}
                                                            onClick={() => onClick(i)}
                                                        >
                                                            {number}
                                                        </Link>
                                                        ))}
                                                    </span>
                                                    <Link
                                                        className="paginate_button next"
                                                        to="/email-template"
                                                        onClick={() =>
                                                        activePag.current + 1 < paggination.length &&
                                                        onClick(activePag.current + 1)
                                                        }
                                                    >
                                                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                                                    </Link>
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Collapse> 
                    </div>
                </div>
            </div>
        </>
    )
}
export default EmailTemplate;