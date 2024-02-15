import { Button, Spinner } from "react-bootstrap";

const Sidebar = ({ selectedPhotos, handleDeletePhotos, isDeleting, handleSharePhotos, isSharing }) => {


    return (
        <div className={`sidebar-container ${selectedPhotos.length > 0 ? "open" : ""}`}>
            <div className="sidebar-wrapper">
                <ul className="sidebar-list">
                    <li className="sidebar-listItem">
                        <Button onClick={handleSharePhotos}>
                            {isSharing ? (
                                <Spinner animation="border" role="status" className="sidebar-listIcon" />
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6 sidebar-listIcon">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                    </svg>
                                    <span className="sidebar-listItemText">Share</span>
                                </>
                            )}

                        </Button>
                    </li>
                    {/* <li className="sidebar-listItem">
                        <Button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6 sidebar-listIcon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                            </svg>

                            <span className="sidebar-listItemText">Add to album</span>
                        </Button>
                    </li> */}
                    <li className="sidebar-listItem">
                        <Button onClick={handleDeletePhotos}>
                            {isDeleting ? (
                                <Spinner animation="border" role="status" className="sidebar-listIcon" />
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6 sidebar-listIcon">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    <span className="sidebar-listItemText">Delete</span>
                                </>
                            )}

                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;