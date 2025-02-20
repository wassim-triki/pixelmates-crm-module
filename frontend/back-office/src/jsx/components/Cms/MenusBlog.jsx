import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {Tab, Nav, Collapse} from 'react-bootstrap';

const formDataLabel = [
    {title: 'Privacy Policy', id: '12'},
    {title: 'Contact Us', id: '13'},
    {title: 'Important Information', id: '14'},
    {title: 'About Us', id: '15'},
    {title: 'Dummy Co', id: '16'},
];

const MenusBlog = () =>{
    const [open, setOpen] = useState(true);
    const [open2, setOpen2] = useState(true);
    const [checked, setChecked] = useState(false);
    const [openFirst, setOpenFirst] = useState(true);
    return(
        <>
            <div className="filter cm-content-box box-primary">
                <div className="content-title">
                    <div className="cpa">
                        Menus
                    </div>
                    <div className="tools">
                        <Link to={"#"} className={`SlideToolHeader ${openFirst ? 'collapse' : 'expand' }`}
                            onClick={() => setOpenFirst(!openFirst)}
                        >
                            <i className="fas fa-angle-up" />
                        </Link>
                    </div>
                </div>
                <Collapse in={openFirst}>
                    <div className="cm-content-body form excerpt">
                        <div className="card-body">
                            <div className="filter cm-content-box box-primary border">
                                <div className="content-title border-0">
                                    <div className="cpa">
                                        Page
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
                                    <div className="cm-content-inner form excerpt border-top">
                                        <div className="card-body">
                                            <Tab.Container defaultActiveKey="View">
                                                <Nav as="ul" className=" tab-my nav nav-tabs" id="myTab" >
                                                    <Nav.Item as="li" className="nav-item me-1" role="presentation">
                                                        <Nav.Link as="button"  eventKey="View"  type="button">View All</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item as="li"  className="nav-item">
                                                        <Nav.Link as="button" eventKey="Search"   type="button">Search</Nav.Link>
                                                    </Nav.Item>                                        
                                                </Nav>
                                                <Tab.Content className="tab-content" id="myTabContent">
                                                    <Tab.Pane  eventKey="View">
                                                        <div className="menu-tabs cms-menu-1">
                                                            {formDataLabel.map((item,ind)=>(
                                                                <div className="form-check" key={ind}>
                                                                    <input className="form-check-input" type="checkbox" 
                                                                        id={`flexlabel-${item.id}`}
                                                                        checked={checked}
                                                                    />
                                                                    <label className="form-check-label" 
                                                                        htmlFor={`flexlabel-${item.id}`}
                                                                    >
                                                                        {item.title}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                            
                                                            <div className="d-flex align-items-center flex-wrap">
                                                                <Link to={"#"} className="text-primary fs-14"                                                               
                                                                    onClick={()=>{setChecked(true)                                                                    
                                                                }}
                                                                >Select All</Link><span className="mx-2">|</span>
                                                                <Link to={"#"} className="text-primary me-2 fs-14"
                                                                onClick={()=>{setChecked(false)                                                                    
                                                                }}
                                                                >Deselect All</Link>
                                                            </div>
                                                        </div>
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="Search">
                                                        <div className="menu-tabs">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Search</label>
                                                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Page Name" />
                                                        </div>                                                    
                                                    </Tab.Pane>
                                                    <div className="d-flex align-items-center flex-wrap">                                                
                                                        <button type="submit" className="btn btn-primary btn-sm dalb-menu-btn">Add to Menu</button>
                                                    </div>
                                                </Tab.Content>
                                            </Tab.Container>
                                        </div>
                                        
                                    </div>
                                </Collapse>
                            </div>
                            <div className="filter cm-content box-primary border">
                                <div className="content-title border-0">
                                    <div className="cpa">
                                        Links 
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
                                    <div className="cm-content-inner form excerpt border-top">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col-xl-4">
                                                    <h6>URL</h6>
                                                </div>
                                                <div className="col-xl-8">
                                                    <input type="text" className="form-control mb-2" placeholder="https://dexignlab.com/" />
                                                </div>
                                                <div className="col-xl-4">
                                                    <h6>Link Text</h6>
                                                </div>
                                                <div className="col-xl-8">
                                                    <input type="text" className="form-control" placeholder="Menu items" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>   
        </>
    )
}

export default MenusBlog