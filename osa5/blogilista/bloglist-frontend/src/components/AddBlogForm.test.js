import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddBlogForm from './AddBlogForm'

test('<AddBlogForm /> updates parent state and calls onSubmit', () => {

  const createBlog = jest.fn()

  const component = render(
    <AddBlogForm createBlog={createBlog} />
  )
  const title_input = component.container.querySelector('#title')
  const author_input = component.container.querySelector('#author')
  const url_input = component.container.querySelector('#url')

  const form = component.container.querySelector('form')
  console.log('FORM component.debug')
  component.debug()

  fireEvent.change(title_input, {
    target: { value: 'testiblogi' }
  })
  fireEvent.change(author_input, {
    target: { value: 'testikayttaja' }
  })
  fireEvent.change(url_input, {
    target: { value:'www.testi.fi' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testiblogi')
  expect(createBlog.mock.calls[0][0].author).toBe('testikayttaja')
  expect(createBlog.mock.calls[0][0].url).toBe('www.testi.fi')
})