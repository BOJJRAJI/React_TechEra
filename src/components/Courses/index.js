import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const initialApisStates = {
  initial: 'Initial',
  inProgress: 'InProgress',
  success: 'Success',
  failure: 'Failure',
}

class Courses extends Component {
  state = {coursesList: [], apiStatus: initialApisStates.initial}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: initialApisStates.inProgress})

    const options = {method: 'GET'}
    const responce = await fetch('https://apis.ccbp.in/te/courses', options)
    const data = await responce.json()
    console.log(data)
    if (responce.ok) {
      const updatedData = data.courses.map(item => ({
        id: item.id,
        name: item.name,
        logoUrl: item.logo_url,
      }))
      this.setState({
        apiStatus: initialApisStates.success,
        coursesList: updatedData,
      })
    } else {
      this.setState({apiStatus: initialApisStates.failure})
    }
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialApisStates.inProgress:
        return this.renderLoader()
      case initialApisStates.success:
        return this.renderSuccess()
      case initialApisStates.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#1e293b" height={50} width={50} />
    </div>
  )

  renderSuccess = () => {
    const {coursesList} = this.state
    return (
      <div className="courses-container">
        <h1 className="heading">Courses</h1>
        <ul className="list-container">
          {coursesList.map(item => (
            <li className="list-item" key={item.id}>
              <Link to={`/courses/${item.id}`} className="link-element">
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="course-image"
                />
              </Link>
              <p className="course-name">{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="reload-button" onClick={this.getData} type="button">
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <>
        <div className="app-container">
          <Header />
          {this.renderView()}
        </div>
      </>
    )
  }
}

export default Courses
