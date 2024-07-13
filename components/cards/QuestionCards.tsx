import Link from 'next/link'
import RenderTag from '../shared/RenderTag'

import { formatNumber, getTimeStamp } from '@/lib/utils'
import Metric from '../shared/Metric'

interface Props {
  id: string
  title: string
  tags: { _id: string; name: string }[]
  author: { _id: string; name: string; picture: string }
  upvotes: number
  views: number
  answers: Object[]
  createdAt: Date
}

export default function QuestionCards({ id, title, tags, author, upvotes, views, answers, createdAt }: Props) {
  return (
    <div className='card-wrapper rounded-sm p-9 sm:px-11'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div>
          <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`questions/${id}`}>
            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1'>{title}</h3>
          </Link>
        </div>
      </div>
      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <RenderTag key={tag._id} name={tag.name} _id={tag._id} showCount={false} />
        ))}
      </div>
      <div className='mt-6 flex flex-wrap justify-between gap-3'>
        <Metric
          imgUrl='assets/icons/avatar.svg'
          alt='User'
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles='body-medium text-dark400_light700'
          href={`/profile/${author._id}`}
          isAuthor
        />
        <div className='flex justify-between gap-3'>
          <Metric
            imgUrl='assets/icons/like.svg'
            alt='Upvotes'
            value={formatNumber(upvotes)}
            title='Votes'
            textStyles='small-medium text-dark400_light800'
          />
          <Metric
            imgUrl='assets/icons/message.svg'
            alt='Answers'
            value={formatNumber(answers.length)}
            title='Answers'
            textStyles='small-medium text-dark400_light800'
          />
          <Metric
            imgUrl='assets/icons/eye.svg'
            alt='Views'
            value={formatNumber(views)}
            title='Views'
            textStyles='small-medium text-dark400_light800'
          />
        </div>
      </div>
    </div>
  )
}
