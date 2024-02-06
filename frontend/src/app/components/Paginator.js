import React, { useEffect } from 'react'
import { Pagination } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const Paginator = ({ totalNumberOfPhotos, itemsPerPage, activePage, setActivePage }) => {

    const location = useLocation()
    const navigate = useNavigate()

    const totalPages = Math.ceil(totalNumberOfPhotos / itemsPerPage)
    
    const isCurrentPageFirst = activePage === 1
    const isCurrentPageLast = activePage === totalPages

    const onPageChange = (page) => {
        if (activePage === page) return
        setActivePage(page)
        updateUrl(page)
    }

    const updateUrl = (page) => {
        const searchParams = new URLSearchParams(location.search)
        searchParams.set("p", page)
        navigate(`?${searchParams}`)
    }

    const onPageClick = (page) => {
        onPageChange(page)
    }

    const onPreviousPageClick = () => {
        onPageChange(activePage - 1)
    }

    const onNextPageClick = () => {
        onPageChange(activePage + 1)
    }

    // const setLastPageAsActive = () => {
    //     if (activePage > totalPages) {
    //         setActivePage(totalPages)
    //     }
    // }

    let isPageOutOfRange

    const pageNumbers = [...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1
        const isPageFirst = pageNumber === 1
        const isPageLast = pageNumber === totalPages
        const isActivePageWithinTwoPages = Math.abs(pageNumber - activePage) <= 2

        if (
            isPageFirst ||
            isPageLast ||
            isActivePageWithinTwoPages
        ) {
            isPageOutOfRange = false
            return (
                <Pagination.Item
                    key={pageNumber}
                    onClick={() => onPageClick(pageNumber)}
                    active={pageNumber === activePage}
                >
                    {pageNumber}
                </Pagination.Item>
            )
        }

        if (!isPageOutOfRange) {
            isPageOutOfRange = true
            return <Pagination.Ellipsis key={pageNumber} className='muted' />
        }
        return null
    })

    return (
        <>
            {totalPages > 1 && (
                <Pagination size={"sm"}>
                    <Pagination.Prev
                        onClick={onPreviousPageClick}
                        disabled={isCurrentPageFirst}
                    />
                    {pageNumbers}
                    <Pagination.Next
                        onClick={onNextPageClick}
                        disabled={isCurrentPageLast}
                    />
                    {/* {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === activePage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))} */}
                </Pagination>
            )}
        </>
    )
}

export default Paginator