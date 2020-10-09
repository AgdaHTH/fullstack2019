import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { prettyDOM } from '@testing-library/dom'
import blogService from '../services/blogs'

test('renders content', () => {
  const blog = {
    title: 'testiblogi on tärkeä blogi',
    author: 'testikayttaja',
    url: 'www.testiosoite.fi',
    likes: 5
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'testiblogi on tärkeä blogi',
    'testikayttaja'
  )

  expect(component.container).not.toHaveTextContent(
    'www.testiosoite.fi'
  )

  expect(component.container).not.toHaveTextContent(
    '5'
  )

})

test('renders content when view is clicked', () => {
  const blog = {
    title: 'testiblogi on tärkeä blogi',
    author: 'testikayttaja',
    url: 'www.testiosoite.fi',
    likes: 5,
    user: {
      username: 'tester',
      name: 'testaaja'
    }
  }

  const user = {
    name: 'testaaja'
  }

  const component = render(
    <Blog blog={blog} currentUser={user} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'www.testiosoite.fi'
  )

  expect(component.container).toHaveTextContent(
    '5'
  )

})

test('clicking the like button once calls event handler once', () => {
  const blog = {
    title: 'testiblogi on tärkeä blogi',
    author: 'testikayttaja',
    url: 'www.testiosoite.fi',
    likes: 5,
    user: {
      username: 'tester',
      name: 'testaaja'
    }
  }

  const user = {
    name: 'testaaja'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} updateLikes={mockHandler} currentUser={user}  />
  )

  const view_button = component.getByText('view')
  fireEvent.click(view_button)

  console.log('component.debug')
  //component.debug()
  const like_button = component.container.querySelector('#like-button')
  //const like_button = component.getByText('like')

  //console.log('button', prettyDOM(like_button))
  fireEvent.click(like_button)
  fireEvent.click(like_button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})