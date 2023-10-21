import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const initialApisStates = {
  initial: 'Initial',
  inProgress: 'InProgress',
  success: 'Success',
  failure: 'Failure',
}

class CourseDetails extends Component {
  state = {courseItemList: [], apiStatus: initialApisStates.initial}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: initialApisStates.inProgress})
    const {match} = this.props
    console.log(match.params.id)
    const options = {method: 'GET'}
    const responce = await fetch(
      `https://apis.ccbp.in/te/courses/${match.params.id}`,
      options,
    )
    const data = await responce.json()
    console.log(data.course_details)
    if (responce.ok) {
      const updatedData = {
        id: data.course_details.id,
        name: data.course_details.name,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
      }
      console.log(updatedData)
      this.setState({
        apiStatus: initialApisStates.success,
        courseItemList: updatedData,
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
    const {courseItemList} = this.state
    console.log(courseItemList)
    return (
      <div className="course-item-bg-container">
        <div className="course-item-container">
          <img
            src={courseItemList.imageUrl}
            alt={courseItemList.name}
            className="course-item-image"
          />
          <div className="data-container">
            <h1 className="course-item-name">{courseItemList.name}</h1>
            <p className="para">{courseItemList.description}</p>
          </div>
        </div>
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

export default CourseDetails
