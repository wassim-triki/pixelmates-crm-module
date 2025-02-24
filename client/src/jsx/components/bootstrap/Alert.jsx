import React, { Fragment, useReducer } from "react";
import {Link} from 'react-router-dom';
//import data from "./alertData";
import PageTitle from "../../layouts/PageTitle";
import { Row, Card, Col, Alert, Button } from "react-bootstrap";
import {reducer} from './alertReducer';

const emojis = {
  welcome: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <circle cx='12' cy='12' r='10'></circle>
      <path d='M8 14s1.5 2 4 2 4-2 4-2'></path>
      <line x1='9' y1='9' x2='9.01' y2='9'></line>
      <line x1='15' y1='9' x2='15.01' y2='9'></line>
    </svg>
  ),

  done: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'></path>
    </svg>
  ),

  success: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <polyline points='9 11 12 14 22 4'></polyline>
      <path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'></path>
    </svg>
  ),

  info: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <circle cx='12' cy='12' r='10'></circle>
      <line x1='12' y1='16' x2='12' y2='12'></line>
      <line x1='12' y1='8' x2='12.01' y2='8'></line>
    </svg>
  ),

  warning: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
      <line x1='12' y1='9' x2='12' y2='13'></line>
      <line x1='12' y1='17' x2='12.01' y2='17'></line>
    </svg>
  ),

  error: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <polygon points='7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2'></polygon>
      <line x1='15' y1='9' x2='9' y2='15'></line>
      <line x1='9' y1='9' x2='15' y2='15'></line>
    </svg>
  ),
}
const initial = true;
 
const UiAlert = () => {
	const [state, dispatch] = useReducer(reducer, initial);	
  return (
    <Fragment>
      <PageTitle motherMenu="Bootstrap" activeMenu="Alert" />
      <Row>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Basic Alerts</Card.Title>
              <Card.Text className="subtitle mb-0">
                Bootstrap default style
              </Card.Text>
            </Card.Header>
            <Card.Body>					
              <Alert  variant="primary" dismissible show={state.primary}>
                {emojis.welcome}
                <strong>Welcome! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'primary'})}>
                  <span>
                   
                  </span>
                </button>
              </Alert>
              <Alert  variant="secondary" dismissible show={state.secondary}>
                {emojis.done}
                <strong>Done! </strong> Your profile photo updated. 
                <button className="btn-close" onClick={()=>dispatch({type:'secondary'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="success" dismissible show={state.success}>
                {emojis.success}
                <strong>Success! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'success'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="info" dismissible show={state.info}>
                {emojis.info}
                <strong>Info!  </strong> You have got 5 new email. 
                <button className="btn-close" onClick={()=>dispatch({type:'info'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="warning" dismissible show={state.warning}>
                {emojis.warning}
                <strong>Warning! </strong> Something went wrong. Please check.
                <button className="btn-close" onClick={()=>dispatch({type:'warning'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="danger" dismissible show={state.danger}>
                {emojis.error}
                <strong>Error! </strong> Message sending failed.
                <button className="btn-close" onClick={()=>dispatch({type:'danger'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="dark" dismissible show={state.dark}>
                {emojis.error}
                <strong>Error!  </strong> You successfully read this important alert message.
                <button className="btn-close" onClick={()=>dispatch({type:'dark'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="light" dismissible show={state.light}>
                {emojis.error}
                <strong>Error! </strong> You successfully read this message..
                <button className="btn-close" onClick={()=>dispatch({type:'light'})}>
                    <span>
                      
                    </span>
                </button>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Solid color alerts</Card.Title>
              <Card.Text className="subtitle mb-0">
              add <code>.solid</code> class to change the solid color.
              </Card.Text>
            </Card.Header>
            <Card.Body>            
              <Alert  variant="primary" dismissible show={state.solidprimary} className="solid">
                {emojis.welcome}
                <strong>Welcome! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'solidprimary'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="secondary" dismissible show={state.solidsecondary} className="solid">		
               {emojis.done}				
                <strong>Done! </strong> Your profile photo updated. 
                <button className="btn-close" onClick={()=>dispatch({type:'solidsecondary'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="success" dismissible show={state.solidsucces} className="solid">
               {emojis.success}						
                <strong>Success!</strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'solidsucces'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="info" dismissible show={state.solidinfo} className="solid">						
                {emojis.info}
                <strong>Info! </strong> You have got 5 new email. 
                <button className="btn-close" onClick={()=>dispatch({type:'solidinfo'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="warning" dismissible show={state.solidwarning} className="solid">
                {emojis.warning}
                <strong>Warning! </strong> Something went wrong. Please check. 
                <button className="btn-close" onClick={()=>dispatch({type:'solidwarning'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="danger" dismissible show={state.soliddanger} className="solid">
               {emojis.error}
                <strong>Error! </strong> Message sending failed.
                <button className="btn-close" onClick={()=>dispatch({type:'soliddanger'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="dark" dismissible show={state.soliddark} className="solid">
                {emojis.error}
                <strong>Error! </strong> You successfully read this important alert message.
                <button className="btn-close" onClick={()=>dispatch({type:'soliddark'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="light" dismissible show={state.solidlight} className="solid">	
               {emojis.error}					
                <strong>Error! </strong> You successfully read this message..
                <button className="btn-close" onClick={()=>dispatch({type:'solidlight'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Square alerts</Card.Title>
              <p className="mb-0 subtitle">
              add <code>.alert-square</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              <Alert  variant="primary"   className="solid alert-square">						
                <strong>Welcome! </strong> 	Message has been sent.						
              </Alert>
              <Alert  variant="secondary"  className="solid alert-square">						
                <strong>Done! </strong> Your profile photo updated. 						
              </Alert>
              <Alert  variant="success" className="solid alert-square">						
                <strong>Success!</strong> Message has been sent.
              </Alert>
              <Alert  variant="info"  className="solid alert-square">						
                <strong>Info! </strong> You have got 5 new email. 						
              </Alert>
              <Alert  variant="warning"  className="solid alert-square">						
                <strong>Error! </strong> Something went wrong. Please check. 
                
              </Alert>
              <Alert  variant="danger"  className="solid alert-square">						
                <strong>Error! </strong> Message sending failed.
                
              </Alert>
              <Alert  variant="dark"  className="solid alert-square">						
                <strong>Error! </strong> You successfully read this important alert message.
                
              </Alert>
              <Alert  variant="light"  className="solid alert-square">						
                <strong>Error! </strong> You successfully read this message..						
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Rounded alerts</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-rounded</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              <Alert  variant="primary"   className="solid alert-rounded">						
                <strong>Welcome! </strong> Message has been sent.						
              </Alert>
              <Alert  variant="secondary"  className="solid alert-rounded">						
                <strong>Done! </strong> Your profile photo updated. 						
              </Alert>
              <Alert  variant="success" className="solid alert-rounded">						
                <strong>Success!</strong> Message has been sent.
              </Alert>
              <Alert  variant="info"  className="solid alert-rounded">						
                <strong>Info! </strong> You have got 5 new email. 						
              </Alert>
              <Alert  variant="warning"  className="solid alert-rounded">						
                <strong>Error! </strong> Something went wrong. Please check. 
                
              </Alert>
              <Alert  variant="danger"  className="solid alert-rounded">						
                <strong>Error! </strong> Message sending failed.
                
              </Alert>
              <Alert  variant="dark"  className="solid alert-rounded">						
                <strong>Error! </strong> You successfully read this important alert message.
                
              </Alert>
              <Alert  variant="light"  className="solid alert-rounded">						
                <strong>Error! </strong> You successfully read this message..						
              </Alert>			  
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dismissable Alerts</Card.Title>
              <Card.Text className="subtitle mb-0">
                Bootstrap default style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Alert  variant="primary" dismissible show={state.disprimary}>
                <strong>Welcome! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'disprimary'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="secondary" dismissible show={state.dissecondary}>
                <strong>Done! </strong> Your profile photo updated. 
                <button className="btn-close" onClick={()=>dispatch({type:'dissecondary'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="success" dismissible show={state.dissuccess}>
                <strong>Success! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'dissuccess'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="info" dismissible show={state.disinfo}>
                <strong>Info!  </strong> You have got 5 new email. 
                <button className="btn-close" onClick={()=>dispatch({type:'disinfo'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="warning" dismissible show={state.diswarning}>
                <strong>Error! </strong> Something went wrong. Please check.
                <button className="btn-close" onClick={()=>dispatch({type:'diswarning'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="danger" dismissible show={state.disdanger}>
                <strong>Error! </strong> Message sending failed.
                <button className="btn-close" onClick={()=>dispatch({type:'disdanger'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="dark" dismissible show={state.disdark}>
                <strong>Error!  </strong> You successfully read this important alert message.
                <button className="btn-close" onClick={()=>dispatch({type:'disdark'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="light" dismissible show={state.dislight}>
                <strong>Error!  </strong> You successfully read this message..
                <button className="btn-close" onClick={()=>dispatch({type:'dislight'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alerts alt</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-alt</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              <Alert  variant="primary" dismissible show={state.altprimary} className='alert-alt'>
                
                <strong>Welcome! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'altprimary'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="secondary" dismissible show={state.altsecondary} className='alert-alt'>
                
                <strong>Done! </strong> Your profile photo updated. 
                <button className="btn-close" onClick={()=>dispatch({type:'altsecondary'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="success" dismissible show={state.altsuccess} className='alert-alt'>
                
                <strong>Success! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'altsuccess'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="info" dismissible show={state.disinfo} className='alert-alt'>
                
                <strong>Info!  </strong> You have got 5 new email. 
                <button className="btn-close" onClick={()=>dispatch({type:'altinfo'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="warning" dismissible show={state.altwarning} className='alert-alt'>
                
                <strong>Error! </strong> Something went wrong. Please check.
                <button className="btn-close" onClick={()=>dispatch({type:'altwarning'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="danger" dismissible show={state.altdanger} className='alert-alt'>
                
                <strong>Error! </strong> Message sending failed.
                <button className="btn-close" onClick={()=>dispatch({type:'altdanger'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="dark" dismissible show={state.altdark} className='alert-alt'>
                
                <strong>Error!  </strong> You successfully read this important alert message.
                <button className="btn-close" onClick={()=>dispatch({type:'altdark'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="light" dismissible show={state.altlight} className='alert-alt'>
                
                <strong>Error!  </strong> You successfully read this message..
                <button className="btn-close" onClick={()=>dispatch({type:'altlight'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
				
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Solid Alt</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-alt.solid</code> class to change the solid
                color.
              </p>
            </Card.Header>
            <Card.Body>              
                <Alert  variant="primary" dismissible show={state.altsolidprimary} className="solid alert-alt">	
                  {emojis.welcome}	
                  <strong>Welcome! </strong> Message has been sent. 
                  <button className="btn-close" onClick={()=>dispatch({type:'altsolidprimary'})}>
                    <span>
                      
                    </span>                    
                  </button>
                </Alert>
                <Alert  variant="secondary" dismissible show={state.altsolidsecondary} className="solid alert-alt">						
                  {emojis.done}
                  <strong>Done! </strong> Your profile photo updated. 
                  <button className="btn-close" onClick={()=>dispatch({type:'altsolidsecondary'})}>
                    <span>
                      
                    </span>
                  </button>
                </Alert>
                <Alert  variant="success" dismissible show={state.altsolidsucces} className="solid alert-alt">						
                  {emojis.success}
                  <strong>Success!</strong> Message has been sent. 
                  <button className="btn-close" onClick={()=>dispatch({type:'altsolidsuccess'})}>
                    <span>
                      
                    </span>
                  </button>
                </Alert>
                <Alert  variant="info" dismissible show={state.altsolidinfo} className="solid alert-alt">						
                  {emojis.info}
                  <strong>Info! </strong> You have got 5 new email. 
                  <button className="btn-close" onClick={()=>dispatch({type:'altsolidinfo'})}>
                    <span>
                      
                    </span>
                  </button>
                </Alert>
                <Alert  variant="warning" dismissible show={state.altsolidwarning} className="solid alert-alt">						
                  {emojis.error}
                  <strong>Error! </strong> Something went wrong. Please check. 
                  <button className="btn-close" onClick={()=>dispatch({type:'altsolidwarning'})}>
                    <span>
                      
                    </span>
                  </button>
                </Alert>
                <Alert  variant="danger" dismissible show={state.altsoliddanger} className="solid alert-alt">						
                  {emojis.error}
                  <strong>Error! </strong> Message sending failed.
                  <button className="btn-close" onClick={()=>dispatch({type:'altsoliddanger'})}>
                    <span>
                      
                    </span>
                  </button>
                </Alert>
                <Alert  variant="dark" dismissible show={state.altsoliddark} className="solid alert-alt">						
                  {emojis.error}
                  <strong>Error! </strong> You successfully read this important alert message.
                  <button className="btn-close" onClick={()=>dispatch({type:'altsoliddark'})}>
                    <span>
                      
                    </span>
                  </button>
                </Alert>
                <Alert  variant="light" dismissible show={state.altsolidlight} className="solid alert-alt">						
                  {emojis.error}
                  <strong>Error! </strong> You successfully read this message..
                  <button className="btn-close" onClick={()=>dispatch({type:'altsolidlight'})}>
                    <span>
                      
                    </span>
                  </button>
                </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dismissable with solid</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.solid</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>            
              <Alert  variant="primary" dismissible show={state.soliddisprimary} className="solid">	
                {emojis.welcome}	
                <strong>Welcome! </strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'soliddisprimary'})}>
                  <span>
                      
                    </span>
                </button>
              </Alert>
              <Alert  variant="secondary" dismissible show={state.soliddissecondary} className="solid">						
                {emojis.done}
                <strong>Done! </strong> Your profile photo updated. 
                <button className="btn-close" onClick={()=>dispatch({type:'soliddissecondary'})}>
                  <span>
                      
                    </span>
                </button>
              </Alert>
              <Alert  variant="success" dismissible show={state.soliddissuccess} className="solid">						
                {emojis.success}
                <strong>Success!</strong> Message has been sent. 
                <button className="btn-close" onClick={()=>dispatch({type:'soliddissuccess'})}>
                  <span>
                      
                    </span>
                </button>
              </Alert>
              <Alert  variant="info" dismissible show={state.soliddisinfo} className="solid">						
                {emojis.info}
                <strong>Info! </strong> You have got 5 new email. 
                <button className="btn-close" onClick={()=>dispatch({type:'soliddisinfo'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="warning" dismissible show={state.soliddiswarning} className="solid">						
                {emojis.error}
                <strong>Error! </strong> Something went wrong. Please check. 
                <button className="btn-close" onClick={()=>dispatch({type:'soliddiswarning'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
              <Alert  variant="danger" dismissible show={state.soliddisdanger} className="solid">						
                {emojis.error}
                <strong>Error! </strong> Message sending failed.
                <button className="btn-close" onClick={()=>dispatch({type:'soliddisdanger'})}>
                  <span>
                      
                    </span>
                </button>
              </Alert>
              <Alert  variant="dark" dismissible show={state.soliddisdark} className="solid">						
                {emojis.error}
                <strong>Error! </strong> You successfully read this important alert message.
                <button className="btn-close" onClick={()=>dispatch({type:'soliddisdark'})}>
                  <span>
                      
                    </span>
                </button>
              </Alert>
              <Alert  variant="light" dismissible show={state.soliddislight} className="solid">						
                {emojis.error}
                <strong>Error! </strong> You successfully read this message..
                <button className="btn-close" onClick={()=>dispatch({type:'soliddislight'})}>
                  <span>
                    
                  </span>
                </button>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert with Link</Card.Title>
              <p className="mb-0 subtitle">Bootstrap default style</p>
            </Card.Header>
            <Card.Body>
                <Alert  variant="primary" dismissible show={state.linkprimary}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>Please check this one as well. <button className="btn-close" onClick={()=>dispatch({type:'linkprimary'})}><span></span></button></Link>
                </Alert>
                <Alert  variant="secondary" dismissible show={state.linksecondary}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>Please check this one as well. <button className="btn-close" onClick={()=>dispatch({type:'linksecondary'})}><span></span></button></Link>
                </Alert>
                <Alert  variant="success" dismissible show={state.linksuccess}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>Please check this one as well. <button className="btn-close" onClick={()=>dispatch({type:'linksuccess'})}><span></span></button></Link>
                </Alert>
                <Alert  variant="info" dismissible show={state.linkinfo}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>My birthday party <button className="btn-close" onClick={()=>dispatch({type:'linkinfo'})}><span></span></button></Link>
                </Alert>
                <Alert  variant="warning" dismissible show={state.linkwarning}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>Check this out <button className="btn-close" onClick={()=>dispatch({type:'linkwarning'})}><span></span></button></Link>
                </Alert>
                <Alert  variant="danger" dismissible show={state.linkdanger}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>Click here for details. <button className="btn-close" onClick={()=>dispatch({type:'linkdanger'})}><span></span></button></Link>
                </Alert>
                <Alert  variant="dark" dismissible show={state.linkdark}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>Click here for details. <button className="btn-close" onClick={()=>dispatch({type:'linkdark'})}><span></span></button></Link>
                </Alert>
                <Alert  variant="light" dismissible show={state.linklight}>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"}>Click here for details. <button className="btn-close" onClick={()=>dispatch({type:'linklight'})}><span></span></button></Link>
                </Alert>
              
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert with Link and solid color</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.solid</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body> 
              <Alert  variant="primary" dismissible show={state.linkprimary} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} ></Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linkprimary'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
                <Alert  variant="secondary" dismissible show={state.linksecondary} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} className='badge-sm light ms-1 badge badge-secondary'>upgrade</Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linksecondary'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
                <Alert  variant="success" dismissible show={state.linksuccess} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} className='badge-sm light ms-1 badge badge-succes'>upgrade</Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linksuccess'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
                <Alert  variant="info" dismissible show={state.linkinfo} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} className='badge-sm light ms-1 badge badge-info'>upgrade</Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linkinfo'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
                <Alert  variant="warning" dismissible show={state.linkwarning} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} className='badge-sm light ms-1 badge badge-warning'>upgrade</Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linkwarning'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
                <Alert  variant="danger" dismissible show={state.linkdanger} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} className='badge-sm light ms-1 badge badge-danger'>upgrade</Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linkdanger'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
                <Alert  variant="dark" dismissible show={state.linkdark} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} className='badge-sm light ms-1 badge badge-dark'>upgrade</Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linkdark'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
                <Alert  variant="light" dismissible show={state.linklight} className='solid'>               
                    <strong>WOW! Eveything looks OK. </strong>
                    <Link to={"#"} className='badge-sm light ms-1 badge badge-light'>upgrade</Link>   
                    <button className="btn-close" onClick={()=>dispatch({type:'linklight'})}>
                      <span>
                        
                      </span>
                    </button>
                </Alert>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Inline Notifications</Card.Title>
              <p className="mb-0 subtitle">Default inline notification</p>
            </Card.Header>
            <Card.Body>
              <Row>
              
                <Col xl={6}>
                  <Alert  variant="primary"  className="notification">
                      <p className="notificaiton-title mb-2">
                          <strong>Success!</strong> Vampires The Romantic Ideology
                          Behind Them
                      </p>
                      <p>
                          The following article covers a topic that has recently
                         moved to center stage-at lease it seems that way.
                      </p>
                      <Button variant="primary" size="sm">
                          Confirm
                      </Button>
                      <Button variant="link" size="sm">
                          Cancel
                      </Button>
                  </Alert>
                </Col>
                <Col xl={6}>
                    <Alert  variant="secondary"  className="notification">
                        <p className="notificaiton-title mb-2">
                            <strong>Success!</strong> Vampires The Romantic Ideology
                            Behind Them
                        </p>
                        <p>
                            The following article covers a topic that has recently
                          moved to center stage-at lease it seems that way.
                        </p>
                        <Button variant="secondary" size="sm">
                            Confirm
                        </Button>
                        <Button variant="link" size="sm">
                            Cancel
                        </Button>
                    </Alert>
                  </Col>
                  <Col xl={6}>
                    <Alert  variant="success"  className="notification">
                        <p className="notificaiton-title mb-2">
                            <strong>Success!</strong> Vampires The Romantic Ideology
                            Behind Them
                        </p>
                        <p>
                            The following article covers a topic that has recently
                          moved to center stage-at lease it seems that way.
                        </p>
                        <Button variant="success" size="sm">
                            Confirm
                        </Button>
                        <Button variant="link" size="sm">
                            Cancel
                        </Button>
                    </Alert>
                  </Col>
                  <Col xl={6}>
                    <Alert  variant="info"  className="notification">
                        <p className="notificaiton-title mb-2">
                            <strong>Success!</strong> Vampires The Romantic Ideology
                            Behind Them
                        </p>
                        <p>
                            The following article covers a topic that has recently
                          moved to center stage-at lease it seems that way.
                        </p>
                        <Button variant="info" size="sm">
                            Confirm
                        </Button>
                        <Button variant="link" size="sm">
                            Cancel
                        </Button>
                    </Alert>
                  </Col>
                  <Col xl={6}>
                    <Alert  variant="warning"  className="notification">
                        <p className="notificaiton-title mb-2">
                            <strong>Success!</strong> Vampires The Romantic Ideology
                            Behind Them
                        </p>
                        <p>
                            The following article covers a topic that has recently
                          moved to center stage-at lease it seems that way.
                        </p>
                        <Button variant="warning" size="sm">
                            Confirm
                        </Button>
                        <Button variant="link" size="sm">
                            Cancel
                        </Button>
                    </Alert>
                  </Col>
                  <Col xl={6}>
                    <Alert  variant="danger"  className="notification">
                        <p className="notificaiton-title mb-2">
                            <strong>Success!</strong> Vampires The Romantic Ideology
                            Behind Them
                        </p>
                        <p>
                            The following article covers a topic that has recently
                          moved to center stage-at lease it seems that way.
                        </p>
                        <Button variant="danger" size="sm">
                            Confirm
                        </Button>
                        <Button variant="link" size="sm">
                            Cancel
                        </Button>
                    </Alert>
                  </Col>
                  <Col xl={6}>
                    <Alert  variant="dark"  className="notification">
                        <p className="notificaiton-title mb-2">
                            <strong>Success!</strong> Vampires The Romantic Ideology
                            Behind Them
                        </p>
                        <p>
                            The following article covers a topic that has recently
                          moved to center stage-at lease it seems that way.
                        </p>
                        <Button variant="dark" size="sm">
                            Confirm
                        </Button>
                        <Button variant="link" size="sm">
                            Cancel
                        </Button>
                    </Alert>
                  </Col>
                  <Col xl={6}>
                    <Alert  variant="light"  className="notification">
                        <p className="notificaiton-title mb-2">
                            <strong>Success!</strong> Vampires The Romantic Ideology
                            Behind Them
                        </p>
                        <p>
                            The following article covers a topic that has recently
                          moved to center stage-at lease it seems that way.
                        </p>
                        <Button variant="light" size="sm">
                            Confirm
                        </Button>
                        <Button variant="link" size="sm">
                            Cancel
                        </Button>
                    </Alert>
                  </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert Icon Left</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-right-icon</code> to change the style
              </p>
            </Card.Header>
            <Card.Body>
              <Alert  variant="primary" dismissible show={state.iconprimary} className="solid alert-right-icon">						
                  <span><i className='mdi mdi-account-search'></i></span>{" "}
                    Welcome! {" "} Message has been sent. 
                  <button className="btn-close" onClick={()=>dispatch({type:'iconprimary'})}>
                    <span>
                        
                      </span>
                  </button>
              </Alert>
              <Alert  variant="secondary" dismissible show={state.iconsecondary} className="solid alert-right-icon">						
                  <span><i className='icon icon-bell-53'></i></span>{" "}
                   Done! {" "} Your profile photo updated. 
                 <button className="btn-close" onClick={()=>dispatch({type:'iconsecondary'})}><span></span></button>
              </Alert>
              <Alert  variant="success" dismissible show={state.iconsuccess} className="solid alert-right-icon">						
                <span><i className='mdi mdi-check'></i></span>{" "}
                  Success!{" "} Message has been sent. 
                 <button className="btn-close" onClick={()=>dispatch({type:'iconsuccess'})}><span></span></button>
              </Alert>
              <Alert  variant="info" dismissible show={state.iconinfo} className="solid alert-right-icon">						
                <span><i className='mdi mdi-email'></i></span>{" "}
                  Info! {" "} You have got 5 new email. 
                 <button className="btn-close" onClick={()=>dispatch({type:'iconinfo'})}><span></span></button>
              </Alert>
              <Alert  variant="warning" dismissible show={state.iconwarning} className="solid alert-right-icon">						
                  <span><i className='mdi mdi-alert'></i></span>{" "}
                    Error! {" "} Something went wrong. Please check. 
                  <button className="btn-close" onClick={()=>dispatch({type:'iconwarning'})}><span></span></button>
              </Alert>
              <Alert  variant="danger" dismissible show={state.icondanger} className="solid alert-right-icon">						
                  <span><i className='mdi mdi-help'></i></span>{" "}
                    Error! {" "} Message sending failed.
                  <button className="btn-close" onClick={()=>dispatch({type:'icondanger'})}><span></span></button>
              </Alert>
              <Alert  variant="dark" dismissible show={state.icondark} className="solid alert-right-icon">						
                  <span><i className='mdi mdi-settings'></i></span>{" "}
                    Error! {" "} You successfully read this important alert message.
                  <button className="btn-close" onClick={()=>dispatch({type:'icondark'})}><span></span></button>
              </Alert>
              <Alert  variant="light" dismissible show={state.iconlight} className="solid alert-right-icon">						
                  <span><i className='mdi mdi-cogs'></i></span>{" "} 
                    Error! {" "} You successfully read this message..
                  <button className="btn-close" onClick={()=>dispatch({type:'iconlight'})}><span></span></button>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert outline</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-outline-primary,secondary,success...</code> to
                change the style
              </p>
            </Card.Header>
            <Card.Body>             
                <Alert  variant="primary" dismissible show={state.outlineprimary} className="alert-outline-primary">						
                    Welcome! {" "} Message has been sent. 
                  <button className="btn-close" onClick={()=>dispatch({type:'outlineprimary'})}><span></span></button>
                </Alert>
                <Alert  variant="secondary" dismissible show={state.outlinesecondary} className="alert-outline-secondary">						
                   Done! {" "} Your profile photo updated.  
                  <button className="btn-close" onClick={()=>dispatch({type:'outlinesecondary'})}><span></span></button>
                </Alert>
                <Alert  variant="success" dismissible show={state.outlinesuccess} className="alert-outline-success">						
                    Success!{" "} Message has been sent.  
                  <button className="btn-close" onClick={()=>dispatch({type:'outlinesuccess'})}><span></span></button>
                </Alert>
                <Alert  variant="info" dismissible show={state.outlineinfor} className="alert-outline-info">						
                   Info! {" "} You have got 5 new email. 
                  <button className="btn-close" onClick={()=>dispatch({type:'outlineinfor'})}><span></span></button>
                </Alert>
                <Alert  variant="warning" dismissible show={state.outlinewarning} className="alert-outline-warning">						
                   Error! {" "} Something went wrong. Please check. 
                  <button className="btn-close" onClick={()=>dispatch({type:'outlinewarning'})}><span></span></button>
                </Alert>
                <Alert  variant="danger" dismissible show={state.outlinedanger} className="alert-outline-danger">						
                    Error! {" "} Message sending failed. 
                  <button className="btn-close" onClick={()=>dispatch({type:'outlinedanger'})}><span></span></button>
                </Alert>
                <Alert  variant="dark" dismissible show={state.outlinedark} className="alert-outline-dark">						
                    Error! {" "} You successfully read this important alert message. 
                  <button className="btn-close" onClick={()=>dispatch({type:'outlinedark'})}><span></span></button>
                </Alert>
                <Alert  variant="light" dismissible show={state.outlinelight} className="alert-outline-light">						
                   Error! {" "} You successfully read this message..
                  <button className="btn-close" onClick={()=>dispatch({type:'outlinelight'})}><span></span></button>
                </Alert>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert Social</Card.Title>
              <p className="mb-0 subtitle">
                add{" "}
                <code>
                  .alert-social .facebook,.twitter,.linkedin,.google-plus
                </code>{" "}
                to change the style
              </p>
            </Card.Header>
            <Card.Body>
              <Row>
               <Col xl={6}>
                  <Alert  variant="warning" dismissible show={state.socialefacebook} className="facebook alert-social">
                      <button className="btn-close" onClick={()=>dispatch({type:'socialefacebook'})}><span></span></button>
                        <div className='media'>
                            <div className="alert-social-icon">
                              <span><i className="mdi mdi-facebook" /></span>
                            </div>
                            <div className="media-body">  
                              <h5 className="mt-1 mb-2 text-white">Facebook</h5>
                              <p className="mb-0 opacity-75 fs-14">
                                Cras sit amet nibh libero, in gravida nulla. tempus
                                viverra turpis. Fusce condimentum nunc ac nisi
                                vulputate fringilla. Donec lacinia congue felis in
                                faucibus.
                              </p>
                          </div>
                        </div>
                  </Alert>
                </Col>
                <Col xl={6}>
                  <Alert  variant="warning" dismissible show={state.socialtwitter} className="twitter alert-social">
                      <button className="btn-close" onClick={()=>dispatch({type:'socialtwitter'})}><span></span></button>
                        <div className='media'>
                            <div className="alert-social-icon">
                              <span><i className="mdi mdi-twitter" /></span>
                            </div>
                            <div className="media-body">  
                              <h5 className="mt-1 mb-2 text-white">Twitter</h5>
                              <p className="mb-0 opacity-75 fs-14">
                                Cras sit amet nibh libero, in gravida nulla. tempus
                                viverra turpis. Fusce condimentum nunc ac nisi
                                vulputate fringilla. Donec lacinia congue felis in
                                faucibus.
                              </p>
                          </div>
                        </div>
                  </Alert>
                </Col>
                <Col xl={6}>
                  <Alert  variant="warning" dismissible show={state.sociallinkdin} className="linkedin  alert-social">
                      <button className="btn-close" onClick={()=>dispatch({type:'sociallinkdin'})}><span></span></button>
                        <div className='media'>
                            <div className="alert-social-icon">
                              <span><i className="mdi mdi-linkedin" /></span>
                            </div>
                            <div className="media-body">  
                              <h5 className="mt-1 mb-2 text-white">Linkedin</h5>
                              <p className="mb-0 opacity-75 fs-14">
                                Cras sit amet nibh libero, in gravida nulla. tempus
                                viverra turpis. Fusce condimentum nunc ac nisi
                                vulputate fringilla. Donec lacinia congue felis in
                                faucibus.
                              </p>
                          </div>
                        </div>
                  </Alert>
                </Col>
                <Col xl={6}>
                  <Alert  variant="warning" dismissible show={state.socialgoogle} className="google-plus alert-social">
                      <button className="btn-close" onClick={()=>dispatch({type:'socialgoogle'})}><span></span></button>
                        <div className='media'>
                            <div className="alert-social-icon">
                              <span><i className="mdi mdi-google-plus" /></span>
                            </div>
                            <div className="media-body">  
                              <h5 className="mt-1 mb-2 text-white">Google Plus</h5>
                              <p className="mb-0 opacity-75 fs-14">
                                Cras sit amet nibh libero, in gravida nulla. tempus
                                viverra turpis. Fusce condimentum nunc ac nisi
                                vulputate fringilla. Donec lacinia congue felis in
                                faucibus.
                              </p>
                          </div>
                        </div>
                  </Alert>
                </Col>

                
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Message Alert</Card.Title>
              <Card.Text className="subtitle mb-0">
                Bootstrap default style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Row>
                
                  <Col xl={6}>
                      <Alert  variant="primary" dismissible show={state.messageprimary} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messageprimary'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                    </Col>  
                    <Col xl={6}>    
                      <Alert  variant="secondary" dismissible show={state.messagesecondary} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messagesecondary'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                    </Col>  
                    <Col xl={6}>  
                      <Alert  variant="success" dismissible show={state.messagesuccess} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messagesuccess'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                    </Col>  
                    <Col xl={6}>
                      <Alert  variant="info" dismissible show={state.messageinfo} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messageinfo'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                    </Col>  
                    <Col xl={6}>
                      <Alert  variant="warning" dismissible show={state.messagewarning} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messagewarning'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                    </Col>  
                    <Col xl={6}>
                      <Alert  variant="danger" dismissible show={state.messagedanger} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messagedanger'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                    </Col>  
                    <Col xl={6}>
                      <Alert  variant="dark" dismissible show={state.messagedark} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messagedark'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                    </Col>  
                    <Col xl={6}>
                      <Alert  variant="light" dismissible show={state.messagelight} className="">
                          <button className="btn-close" onClick={()=>dispatch({type:'messagelight'})}><span></span></button>
                          <div className='media'>
                              <div className="media-body">
                                  <h5 className="mt-1 mb-1">Notifications</h5>
                                  <p className="mb-0">
                                    Cras sit amet nibh libero, in gravida nulla. tempus
                                    viverra turpis. Fusce condimentum nunc ac nisi
                                    vulputate fringilla. Donec lacinia congue felis in
                                    faucibus.
                                  </p>
                              </div>
                          </div>
                      </Alert>
                  </Col> 
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Message Alert with Solid color</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.solid</code> to change the style
              </p>
            </Card.Header>
            <Card.Body>
              <Row>
                
                  <Col xl={6}>
                    <Alert  variant="primary" dismissible show={state.solidmessageprimary} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessageprimary'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 text-white">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>  
                  <Col xl={6}>    
                    <Alert  variant="secondary" dismissible show={state.solidmessagesecondary} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessagesecondary'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 text-white">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>  
                  <Col xl={6}>  
                    <Alert  variant="success" dismissible show={state.solidmessagesuccess} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessagesuccess'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 text-white">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>  
                  <Col xl={6}>
                    <Alert  variant="info" dismissible show={state.solidmessageinfo} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessageinfo'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 text-white">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>  
                  <Col xl={6}>
                    <Alert  variant="warning" dismissible show={state.solidmessagewarning} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessagewarning'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 text-white">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>  
                  <Col xl={6}>
                    <Alert  variant="danger" dismissible show={state.solidmessagedanger} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessagedanger'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 text-white">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>  
                  <Col xl={6}>
                    <Alert  variant="dark" dismissible show={state.solidmessagedark} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessagedark'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 text-white">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>  
                  <Col xl={6}>
                    <Alert  variant="light" dismissible show={state.solidmessagelight} className="solid">
                        <button className="btn-close" onClick={()=>dispatch({type:'solidmessagelight'})}><span></span></button>
                        <div className='media'>
                            <div className="media-body">
                                <h5 className="mt-1 mb-2 ">Notifications</h5>
                                <p className="mb-0">
                                  Cras sit amet nibh libero, in gravida nulla. tempus
                                  viverra turpis. Fusce condimentum nunc ac nisi
                                  vulputate fringilla. Donec lacinia congue felis in
                                  faucibus.
                                </p>
                            </div>
                        </div>
                    </Alert>
                  </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert left icon big </Card.Title>
              <p className="mb-0 subtitle">
                add <code>.left-icon-big</code> to change the style
              </p>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xl={6}>
                  <Alert  variant="primary" dismissible show={state.iconbigprimary} className="left-icon-big">
                      <button className="btn-close" onClick={()=>dispatch({type:'iconbigprimary'})}><span></span></button>
                        <div className='media'>
                            <div variant="" className="alert-left-icon-big">
                                <span>
                                  <i className="mdi mdi-email-alert"></i>
                                </span>
                            </div>
                            <div className="media-body">
                                <h6 className="mt-1 mb-2">Welcome to your account, Dear user!</h6>
                                <p className="mb-0">Please confirm your email address: email@example.com</p>
                            </div>
                        </div>
                  </Alert>
                </Col>
                <Col xl={6}>
                  <Alert  variant="warning" dismissible show={state.iconbigwarning} className="left-icon-big">
                      <button className="btn-close" onClick={()=>dispatch({type:'iconbigwarning'})}><span></span></button>
                        <div className='media'>
                            <div variant="" className="alert-left-icon-big">
                                <span>
                                  <i className="mdi mdi-help-circle-outline"></i>
                                </span>
                            </div>
                            <div className="media-body">
                                <h6 className="mt-1 mb-2">Pending!</h6>
                                <p className="mb-0">You message sending failed.</p>
                            </div>
                        </div>
                  </Alert>
                </Col>
                <Col xl={6}>
                  <Alert  variant="success" dismissible show={state.iconbigsuccess} className="left-icon-big">
                      <button className="btn-close" onClick={()=>dispatch({type:'iconbigsuccess'})}><span></span></button>
                        <div className='media'>
                            <div variant="" className="alert-left-icon-big">
                                <span>
                                  <i className="mdi mdi-check-circle-outline"></i>
                                </span>
                            </div>
                            <div className="media-body">
                                <h6 className="mt-1 mb-2">Congratulations!</h6>
                                <p className="mb-0">You have successfully created a account.</p>
                            </div>
                        </div>
                  </Alert>
                </Col>
                <Col xl={6}>
                  <Alert  variant="danger" dismissible show={state.iconbigdanger} className="left-icon-big">
                      <button className="btn-close" onClick={()=>dispatch({type:'iconbigdanger'})}><span></span></button>
                        <div className='media'>
                            <div variant="" className="alert-left-icon-big">
                                <span>
                                  <i className="mdi mdi-alert"></i>
                                </span>
                            </div>
                            <div className="media-body">
                                <h6 className="mt-1 mb-2">Loading failed!</h6>
                                <p className="mb-0">Again upload your server</p>
                            </div>
                        </div>
                  </Alert>
                </Col>
                
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiAlert;