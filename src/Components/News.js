import React, { useEffect, useState } from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
      const [articles, setArticles] = useState([])
      const [loading, setLoading] = useState(true)
      const [page, setPage] = useState(1)
      const [totalResults, setTotalResults] = useState(0)
      const backendUrl = 'https://news-monkey-xi-ecru.vercel.app';

      const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
      }

      const updateNews = async () => {
            props.setProgress(10);
            const url = `${backendUrl}/api/news?country=${props.country}&category=${props.category}&page=${page}&pageSize=${props.pageSize}`;
            setLoading(true);
            try {
                  let data = await fetch(url);
                  if (!data.ok) {
                    throw new Error(`HTTP error! Status: ${data.status}`);
                  }
                  props.setProgress(30);
                  let parsedData = await data.json();
                  props.setProgress(70);
                  setArticles(parsedData.articles || []);
                  setTotalResults(parsedData.totalResults || 0);
            } catch (error) {
                  console.error('Error fetching news:', error);
            } finally {
                  setLoading(false);
                  props.setProgress(100);
            }
      };

      useEffect(() => {
            document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
            updateNews();
            // eslint-disable-next-line
      }, [])


      const fetchMoreData = async () => {
            const url = `${backendUrl}/api/news?country=${props.country}&category=${props.category}&page=${page}&pageSize=${props.pageSize}`;
            setPage(page + 1);
            try {
                  let data = await fetch(url);
                  if (!data.ok) {
                    throw new Error(`HTTP error! Status: ${data.status}`);
                  }
                  let parsedData = await data.json();
                  setArticles((prevArticles) => prevArticles.concat(parsedData.articles || []));
                  setTotalResults(parsedData.totalResults || 0);
            } catch (error) {
                  console.error('Error fetching more news:', error);
            }
      };

      return (
            <>
                  <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                  {loading && <Spinner />}
                  <InfiniteScroll
                        dataLength={articles.length}
                        next={fetchMoreData}
                        hasMore={articles.length !== totalResults}
                        loader={<Spinner />}
                  >
                        <div className="container">

                              <div className="row">
                                    {articles.map((element) => {
                                          return <div className="col-md-4" key={element.url}>
                                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                          </div>
                                    })}
                              </div>
                        </div>
                  </InfiniteScroll>
            </>
      )

}


News.defaultProps = {
      country: 'in',
      pageSize: 8,
      category: 'general',
}

News.propTypes = {
      country: PropTypes.string,
      pageSize: PropTypes.number,
      category: PropTypes.string,
      apiKey: PropTypes.string.isRequired,
      setProgress: PropTypes.func.isRequired,
};

export default News
