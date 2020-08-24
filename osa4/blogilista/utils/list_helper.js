const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const reducer = (sum, item) => {
        return sum + item
      }
    
      return likes.reduce(reducer, 0) 
    }
const favoriteBlog = (blogs) => {
    console.log('testing ...')
    let mostLikes = 0
    let favoriteIndex = 0
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > mostLikes) {
            mostLikes = blogs[i].likes
            favoriteIndex = i
        }
    }
    return { title: blogs[favoriteIndex].title, 
        author: blogs[favoriteIndex].author, 
        likes: blogs[favoriteIndex].likes }
}

const mostBlogs = (blogs) => {


    const authors = blogs.map(blog => blog.author)
    console.log(authors)
    const uniqueAuthors = [...new Set(authors)]
    console.log(uniqueAuthors)
    const blogsAndAuthors = uniqueAuthors.map(auth => ({author: auth, blogs: blogs.filter(bg => bg.author === auth)})) 
    console.log(blogsAndAuthors)
    const authorsAndBlogCounts = blogsAndAuthors.map(auth => ({...auth, blogTotal:auth.blogs.length}))
    console.log(authorsAndBlogCounts)
    const orderedAuthorsAndBlogs = authorsAndBlogCounts.sort((a, b) => (a.blogTotal > b.blogTotal) ? 1 : -1)
    console.log(orderedAuthorsAndBlogs)
    const aAndB = orderedAuthorsAndBlogs[orderedAuthorsAndBlogs.length-1]
    console.log('valmis', aAndB)

    return { author: aAndB.author, blogs: aAndB.blogTotal}

}

  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }