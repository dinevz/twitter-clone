import { decode } from 'html-entities';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { timestampConverter } from '../../helpers/timestampConverter';
import { getCommentCount } from '../../services/commentService';
import { deletePost } from '../../services/contentServices';
import { getLikesCount, like, getIsLiked, dislike } from '../../services/likeService';
import postContentShortener from '../../helpers/postContentShortener';




export default function HomePostCard({ user, post, updatePosts }) {
    const [commentsCount, setCommentsCount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getCommentCount(user.accessToken, post._id)
            .then(res => { setCommentsCount(res) })
        getLikesCount(user.accessToken, post._id)
            .then(res => {
                setLikesCount(res)
            })
        getIsLiked(user.accessToken, post._id)
            .then(res => {
                if (res.filter(x => x._ownerId === user._id).length > 0) {
                    setIsLiked(true)
                }
            })

    }, [user.accessToken, post._id, commentsCount, user._id])

    const likeHandler = (e) => {
        e.preventDefault();
        if (post._ownerId === user._id) {
            return
        }
        if (!isLiked) {
            like(post._id, user.accessToken)
                .then(res => {
                    setLikesCount(oldState => oldState + 1)
                    setIsLiked(true);
                })
        } else {
            getIsLiked(user.accessToken, post._id)
                .then(res => {
                    let likeId = res.filter(x => x._ownerId === user._id)
                    dislike(likeId[0]._id, user.accessToken)
                        .then(result => {
                            setLikesCount(oldState => oldState - 1)
                            setIsLiked(false);
                        })
                })
        }
    }

    const deletePostHandler = () => {
        deletePost(post._id, user.accessToken)
            .then(res => {
                updatePosts();
                navigate('/home');
            })
    }

    return (
        <div className="post-container">
            {post._createdOn ? (
                <>
                    <img className="user-avatar" src={post.userImg ? post.userImg : "/assets/images/default_user_icon.jpg"} alt="User" />
                    <div className="post-text-container">
                        <div class="post-text-wrapper">
                            <NavLink className="profile-link" to={'/profile/' + post._ownerId} >
                                <h6 className="user-info-body">
                                    {post.userFN} {post.userLN}
                                    <span className="small-text">@{post.userUN}</span>
                                    <span className="small-text"> • </span>
                                    <span className="small-text">{timestampConverter(post._createdOn)} ago</span>
                                </h6>
                            </NavLink>
                            {post._updatedOn ? <span className="small-text edited">Edited: {timestampConverter(post._updatedOn)} ago</span> : ''}
                            {post._ownerId === user._id ?
                                <div className="dropdown">
                                    <span className="triple-dots" ><i className="fa-solid fa-ellipsis"></i></span>
                                    <div className="dropdown-content">
                                        <NavLink className="edit-btn" to={'/edit/' + post._id}>Edit</NavLink>
                                    </div>
                                </div>
                                : ''}
                            
                        </div>
                        <p className="text-body" >{post.content ? decode(postContentShortener(post.content).join('\n')) : ''}</p>
                        <div className="media-container home-card">
                            {post.media ?
                                (<>
                                    <img className="media" alt="gif/img" src={post.media}></img>
                                </>
                                )
                                : ''}
                        </div>
                        <ul>
                            <li>
                                <NavLink className="details-link comment" to={"/details/" + post._id}>
                                    <i className="fa-solid fa-comment"></i>
                                    <span className="small-text">{commentsCount}</span>
                                </NavLink>

                            </li>
                            <li onClick={(e) => likeHandler(e)}>
                                <div className="like">
                                    <i className="fa-solid fa-heart" style={{
                                        color: isLiked ? '#E52B50' : ''
                                    }}></i>
                                    <span className="small-text">{likesCount}</span>
                                </div>
                            </li>
                            {user._id === post._ownerId ?
                                (

                                    <li className="details-li">
                                        <i onClick={() => deletePostHandler()} className="fa-solid fa-trash"></i>
                                    </li>
                                ) : <li></li>}
                        </ul>
                    </div>
                </>
            ) : ''}

        </div>
    )
}