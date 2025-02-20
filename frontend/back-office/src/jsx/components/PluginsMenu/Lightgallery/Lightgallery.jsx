import React from 'react';

import LightGallery from 'lightgallery/react';
// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import big1 from '../../../../assets/images/big/img1.jpg';
import big2 from '../../../../assets/images/big/img2.jpg';
import big3 from '../../../../assets/images/big/img3.jpg';
import big4 from '../../../../assets/images/big/img4.jpg';
import big5 from '../../../../assets/images/big/img5.jpg';
import big6 from '../../../../assets/images/big/img6.jpg';
import big7 from '../../../../assets/images/big/img7.jpg';
import big8 from '../../../../assets/images/big/img8.jpg';
import PageTitle from '../../../layouts/PageTitle';

const lightGallery = [
	{ large : big1, thumb :	big1,	},	
	{ large : big2, thumb :	big2,	},	
	{ large : big3, thumb :	big3,	},	
	{ large : big4, thumb :	big4,	},	
	{ large : big5, thumb :	big5,	},	
	{ large : big6, thumb :	big6,	},	
	{ large : big7, thumb :	big7,	},	
	{ large : big8, thumb :	big8,	},	
];

const Lightgallery =()=>{		
	return(
		<>
			<PageTitle activeMenu="Light Gallery" motherMenu="Plugins" />					
			<div className="row">
				<div className="col-lg-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Light Gallery</h4>
						</div>						
						<div className="card-body pb-1">
							<LightGallery
								speed={500}
								plugins={[lgThumbnail, lgZoom]}
								elementClassNames="row"
							>
								{lightGallery.map((item,index)=>(
									<div data-src={item.thumb} className="col-lg-3 col-md-6 mb-4" key={index}>
										<img src={item.thumb} style={{width:"100%"}} alt="gallery" className='cursor-pointer'/>
									</div>
								))}
							</LightGallery>					
								
						</div>
					</div>
					{/* <!-- /# card --> */}
				</div>
			</div>
		</>
	)
	
}
export default Lightgallery;