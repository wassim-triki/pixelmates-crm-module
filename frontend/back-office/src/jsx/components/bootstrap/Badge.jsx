import React from "react";

/// Bootstrap
import { Col, Badge, Card, Row } from "react-bootstrap";

import PageTitle from "../../layouts/PageTitle";

const UiBadge = () => {
  return (
    <div className="badge-demo">
      <PageTitle
        motherMenu="Bootstrap"
        activeMenu="Badge"
        pageContent="Badge"
      />
      <Row>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
				<Card.Title>Badges Size</Card.Title>
					<Card.Text className="mb-0 subtitle">
						Default Bootstrap Badges
					</Card.Text>
				</Card.Header>
				<Card.Body>
					<div className="bootstrap-badge">
						<Badge bg="" className='badge-primary light badge-xs'>Primary</Badge>
						<Badge bg="" className='badge-primary light badge-sm'>Primary</Badge>
						<Badge bg="" className='badge-secondary light'>Secondary</Badge>
						<Badge bg=" badge-lg " className='badge-danger light'>Danger</Badge>
						<Badge bg=" badge-xl " className='badge-warning light'>Warning</Badge>
					</div>
				</Card.Body>
			</Card>
		</Col>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
					<Card.Title>Badges Light</Card.Title>
						<Card.Text className="mb-0 subtitle">
							Default Bootstrap Badges
						</Card.Text>
					</Card.Header>
				<Card.Body>
					<div className="bootstrap-badge">
						<Badge bg="" className='badge-primary light'>Primary</Badge>
						<Badge bg="" className='badge-secondary light'>Secondary</Badge>
						<Badge bg="" className='badge-success light'>Success</Badge>
						<Badge bg="" className='badge-danger light'>Danger</Badge>
						<Badge bg="" className='badge-warning light'>Warning</Badge>
						<Badge bg="" className='badge-info light'>Info</Badge>
						<Badge bg="" className='badge-light light text-dark'>Light</Badge>
						<Badge bg="" className='badge-dark light'>Dark</Badge>
					</div>
					<div className="bootstrap-badge">
						<Badge bg="" className='badge-primary light'>1</Badge>
						<Badge bg="" className='badge-secondary light'>2</Badge>
						<Badge bg="" className='badge-success light'>3</Badge>
						<Badge bg="" className='badge-danger light'>4</Badge>
						<Badge bg="" className='badge-warning light'>5</Badge>
						<Badge bg="" className='badge-info light'>6</Badge>
						<Badge bg="" className='badge-light light text-dark'>7</Badge>
						<Badge bg="" className='badge-dark light'>8</Badge>
					</div>
				</Card.Body>
			</Card>
        </Col>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
					<Card.Title>Badges </Card.Title>
					<Card.Text className="mb-0 subtitle">
						Default Bootstrap Badges
					</Card.Text>
				</Card.Header>
				<Card.Body>
					<div className="bootstrap-badge">
						<Badge bg="primary">Primary</Badge>
						<Badge bg="secondary">Secondary</Badge>
						<Badge bg="success">Success</Badge>
						<Badge bg="danger">Danger</Badge>
						<Badge bg="warning">Warning</Badge>
						<Badge bg="info">Info</Badge>
						<Badge bg="light" className="text-dark">Light</Badge>
						<Badge bg="dark">Dark</Badge>
					</div>
				</Card.Body>
			</Card>
        </Col>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
					<Card.Title>Pill Badge </Card.Title>
					<Card.Text className="mb-0 subtitle">
						add <code>.badge-pill</code> to change the style
					</Card.Text>
				</Card.Header>
				<Card.Body>
					<div className="bootstrap-badge">
						<Badge   bg="primary">Pill badge</Badge>
						<Badge   bg="secondary">Pill badge</Badge>
						<Badge   bg="success">Pill badge</Badge>
						<Badge   bg="danger">Pill badge</Badge>
						<Badge   bg="warning">Pill badge</Badge>
						<Badge   bg="info">Pill badge</Badge>
						<Badge className="text-dark"  bg="light">Pill badge</Badge>
						<Badge   bg="dark">Pill badge</Badge>
					</div>
				</Card.Body>
			</Card>
        </Col>

        <Col lg="6">
          <Card>
				<Card.Header className="d-block">
					<Card.Title>Link Badge </Card.Title>
					<Card.Text className="mb-0 subtitle">
						Link badge add in anchor tag
					</Card.Text>
				</Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
					<Badge as="a" href="" bg="primary">Links</Badge>
					<Badge as="a" href="" bg="secondary">Links</Badge>
					<Badge as="a" href="" bg="success">Links</Badge>
					<Badge as="a" href="" bg="danger">Links</Badge>
					<Badge as="a" href="" bg="warning">Links</Badge>
					<Badge as="a" href="" bg="info">Links</Badge>
					<Badge as="a" href="" className="text-dark" bg="light">Links</Badge>
					<Badge as="a" href="" bg="dark">Links</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Rounded Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-rounded</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" bg="primary badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" bg="secondary badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" bg="success badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" bg="danger badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" bg="warning badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" bg="info badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href=""className="text-dark" bg="light badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" bg="dark badge-rounded">
                  Rounded
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Rounded Outline Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-rounded</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" bg="badge-rounded" className='badge-outline-primary'>
                  Rounded
                </Badge>

                <Badge as="a" href="" bg=" badge-rounded" className='badge-outline-secondary'>
                  Rounded
                </Badge>

                <Badge as="a" href="" bg=" badge-rounded" className='badge-outline-success'>
                  Rounded
                </Badge>

                <Badge as="a" href="" bg=" badge-rounded" className='badge-outline-danger'>
                  Rounded
                </Badge>

                <Badge as="a" href="" bg=" badge-rounded" className='badge-outline-warning'>
                  Rounded
                </Badge>

                <Badge as="a" href="" bg=" badge-rounded" className='badge-outline-info'>
                  Rounded
                </Badge>

                <Badge as="a" href="" bg=" badge-rounded" className='badge-outline-light'>
                  Rounded
                </Badge>

                <Badge as="a" href="" bg="badge-rounded" className='badge-outline-dark'>
                  Rounded
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Outline Circle Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-circle</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-primary'>
                  1
                </Badge>

                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-secondary'>
                  2
                </Badge>

                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-success'>
                  3
                </Badge>

                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-danger'>
                  4
                </Badge>

                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-warning'>
                  5
                </Badge>

                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-info'>
                  6
                </Badge>

                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-light'>
                  7
                </Badge>

                <Badge as="a" href="" bg=" badge-circle" className='badge-outline-dark'>
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Circle Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-circle</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" bg="primary badge-circle">
                  1
                </Badge>

                <Badge as="a" href="" bg="secondary badge-circle">
                  2
                </Badge>

                <Badge as="a" href="" bg="success badge-circle">
                  3
                </Badge>

                <Badge as="a" href="" bg="danger badge-circle">
                  4
                </Badge>

                <Badge as="a" href="" bg="warning badge-circle">
                  5
                </Badge>

                <Badge as="a" href="" bg="info badge-circle">
                  6
                </Badge>

                <Badge as="a" href="" bg="light badge-circle" className="text-dark">
                  7
                </Badge>

                <Badge as="a" href="" bg="dark badge-circle">
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Outline Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                Default bootstrap outline baadge
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" bg="" className='badge-outline-primary'>
                  1
                </Badge>

                <Badge as="a" href="" bg="" className='badge-outline-secondary'>
                  2
                </Badge>

                <Badge as="a" href="" bg="" className='badge-outline-success'>
                  3
                </Badge>

                <Badge as="a" href="" bg="" className='badge-outline-danger'>
                  4
                </Badge>

                <Badge as="a" href="" bg="" className='badge-outline-warning'>
                  5
                </Badge>

                <Badge as="a" href="" bg="" className='badge-outline-info'>
                  6
                </Badge>

                <Badge as="a" href="" bg="" className='badge-outline-light'>
                  7
                </Badge>

                <Badge as="a" href="" bg="" className='badge-outline-dark'>
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Number Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                Default bootstrap outline baadge
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" bg="primary">
                  1
                </Badge>

                <Badge as="a" href="" bg="secondary">
                  2
                </Badge>

                <Badge as="a" href="" bg="success">
                  3
                </Badge>

                <Badge as="a" href="" bg="danger">
                  4
                </Badge>

                <Badge as="a" href="" bg="warning">
                  5
                </Badge>

                <Badge as="a" href="" bg="info">
                  6
                </Badge>

                <Badge as="a" href="" className="text-dark" bg="light">
                  7
                </Badge>

                <Badge as="a" href="" bg="dark">
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Badge Sizes </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add{" "}
                <code>.badge-xs .badge-sm .badge-md .badge-lg .badge-xl</code>{" "}
                to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" bg="primary badge-xs">
                  xs
                </Badge>

                <Badge as="a" href="" bg="secondary badge-sm">
                  sm
                </Badge>

                <Badge as="a" href="" bg="success badge-md">
                  md
                </Badge>

                <Badge as="a" href="" bg="danger badge-lg">
                  lg
                </Badge>

                <Badge as="a" href="" bg="warning badge-xl">
                  xl
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default UiBadge;