import React from 'react';
import {Link} from 'react-router-dom';
import { Accordion } from 'react-bootstrap';

import Nestable from 'react-nestable';

import {MenuAccordBlog1, MenuAccordBlog2} from './MenuAccord';


const AccordBlog1 = () =>{
   return(
    <Accordion className="accordion menu-accord" defaultActiveKey="-1">
        <Accordion.Item >
            <Accordion.Header className="accordion-header rounded-lg">
                <div className="move-media dd-handle">
                    <i className="fas fa-arrows-alt"></i>
                </div>
                Contact Us 
            </Accordion.Header> 
            <Accordion.Collapse>
                <div className="accordion-body">
                    <MenuAccordBlog1 />
                </div>
            </Accordion.Collapse>                
        </Accordion.Item>        
    </Accordion>
   )
}
const AccordBlog2= ({title, subtitle}) =>{
   return(
    <Accordion className="accordion menu-accord" defaultActiveKey="-1">
        <Accordion.Item>
            <Accordion.Header className="accordion-header rounded-lg">
                <div className="move-media dd-handle">
                    <i className="fas fa-arrows-alt"></i>
                </div>
                {title}                 
            </Accordion.Header>
            <Accordion.Collapse>
                <div className="accordion-body">
                    <MenuAccordBlog2 />
                </div>
            </Accordion.Collapse>               
        </Accordion.Item>        
    </Accordion>
   )
}

const ItemList = [
    {id: 0 , text : <AccordBlog1  />}, 
    {id: 1, text : <AccordBlog2 title="Privacy Policy" subtitle="Fashion" />}, 
    {id: 2, text : <AccordBlog2  title = "Terms and Conditions" subtitle="Lifestyle" />}, 
    {id: 3, text : <AccordBlog2  title = "About Us" subtitle="Food" />}, 
    {id: 4, text : <AccordBlog2  title = "Important Information" subtitle="Beauty"/>}, 
];
const renderItem = ({ item }) => item.text;

const MenusBlog2 = () => {
    return (
        <>
            <div className="filter cm-content-box box-primary">
                <div className="content-title flex-wrap">
                    <div className="cpa d-flex align-items-center flex-wrap">
                        Menu Name
                        <input type="text" className="form-control w-auto ms-2" placeholder="information" />
                    </div>
                    <button type="submit" className="btn btn-secondary light ms-sm-auto mb-2 mb-sm-0">Save Menu</button>
                </div>
                <div className="cm-content-body form excerpt">
                    <div className="card-body">
                        <h6 className="mb-0">Menu Structure</h6>
                        <p>Add menu items from the column on the left.</p>
                        <div className="col-xl-7 nestable accord-data">
                            <div className="" id="nestable">
                                <ol className="dd-list ps-0" id="accordionExample-1">                                    
                                    <li className="dd-item menu-ac-item" >
                                        <Nestable
                                            items={ItemList}
                                            renderItem={renderItem}
                                            className='ps-0'
                                        />  
                                        
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>		
                </div>
                <div className="filter cm-content-box box-primary style-1 mb-0 border-0 ">
                    <div className="content-title border-bot">
                        <div className="cpa">
                            <Link to={"#"} className='text-primary'>Delete Menu</Link>
                        </div>
                        <button type="submit" className="btn btn-secondary light my-2">Save Menu</button>
                    </div>
                </div>
            </div>            
        </>
    );
};



export default MenusBlog2;