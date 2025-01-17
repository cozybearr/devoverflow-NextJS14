'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { QuestionSchemaType, QuestionsSchema } from '@/lib/validations'
import { Editor } from '@tinymce/tinymce-react'
import React, { useRef, useState } from 'react'
import { Badge } from '../ui/badge'
import Image from 'next/image'
import { createQuestion } from '@/lib/actions/question.action'
import { useRouter, usePathname } from 'next/navigation'
const type = 'edit'

interface Props {
  mongoUserId: string
}

const QuestionForm = ({ mongoUserId }: Props) => {
  const editorRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathName = usePathname()
  const form = useForm<QuestionSchemaType>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  })

  async function onSubmit(values: QuestionSchemaType) {
    setIsSubmitting(true)
    try {
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathName,
      })
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault()
      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()
      console.log(tagValue)
      if (tagValue !== '') {
        if (tagValue.length > 15) {
          form.setError('tags', {
            type: 'maxLength',
            message: 'Tag should not exceed 15 characters',
          })
          return
        }
        if (!field.value.includes(tagValue.toUpperCase())) {
          form.setValue('tags', [...field.value, tagValue.toUpperCase()])
          tagInput.value = ''
          form.clearErrors('tags')
        }
      }
    }
  }

  const handleRemoveTag = (tag: string, field: any) => {
    if (field.value.includes(tag)) {
      form.setValue(
        'tags',
        field.value.filter((t: string) => t !== tag)
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-10'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Question Title
                <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl className='mt-3.5'>
                <Input
                  className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  placeholder='shadcn'
                  {...field}
                />
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Be specific and imagine you&apos;re asking a question to another person.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='explanation'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                What are the details of your problem?
                <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl className='mt-3.5'>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(_evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=''
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                    ],
                    toolbar:
                      'undo redo | blocks | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist ',
                    content_style: 'body { font-family:Inter;font-size:16px }',
                  }}
                />
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </FormDescription>
              <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800 mb-2'>
                Tags <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    placeholder='Add tags...'
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className='flex-start mt-2.5 gap-2.5'>
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          className='subtle-medium background-light800_dark300 text-light400_light500 flex cursor-pointer items-center justify-center gap-2 rounded-md border-none px-4 py-2 uppercase'
                          onClick={() => handleRemoveTag(tag, field)}
                        >
                          {tag}
                          <Image
                            src='/assets/icons/close.svg'
                            alt='Close'
                            width={12}
                            height={12}
                            className='invert-0 dark:invert'
                          ></Image>
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Add up to 3 tags to describe what your question is about. You need to press Enter to add a tag.
              </FormDescription>
              {form.formState.errors.tags ? (
                <FormMessage className='text-red-500' />
              ) : (
                <div className='min-h-[20px]'></div>
              )}
            </FormItem>
          )}
        />
        <Button type='submit' className='primary-gradient !text-light-900 w-fit' disabled={isSubmitting}>
          {isSubmitting ? (
            <>{type === 'edit' ? 'Editing...' : 'Posting...'}</>
          ) : (
            <>{type === 'edit' ? 'Edit question' : 'Ask a question'}</>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default QuestionForm
