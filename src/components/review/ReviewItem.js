import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd'
import face from "../../assets/images/face-1.jpg";
import like from "../../assets/images/like.png";
import dislike from "../../assets/images/dislike.png";

import './reviewItem.scss'

const ReviewItem = () => {
  const navigate = useNavigate()
  const handleDetailReview = (id) => {
    navigate(`../../../../reviews/${id}/detail`)
  }

  return (
    <div className='review-item' onClick={() => handleDetailReview(2)}>
        <div className='review-item-header'>
            <div className='review-item-header-left'>
                <Image src={face} preview={false}/>
                <div className='review-item-header-name'>Le Thanh</div>
                <div className='review-item-header-time'>1h ago</div>
            </div>
            <div className='review-item-header-right'>
                <div className='review-item-header-reaction'>
                    <div className='review-item-header-reaction-amount'>100</div>
                    <Image src={like} preview={false}/>
                </div>
                <div className='review-item-header-reaction'>
                    <div className='review-item-header-reaction-amount'>100</div>
                    <Image src={dislike} preview={false}/>
                </div>
            </div>
        </div>
        <div className='review-item-content'>
            loremdslgtjkfghfdjlkhdfkhjfdk
        </div>
    </div>
  )
}

export default ReviewItem
