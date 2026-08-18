"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import starterKit from '@tiptap/starter-kit'

interface TiptapProps {
    content: string;
    onChange: (richText: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapProps) {
    const editor = useEditor({
        extensions: [starterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus: outline-none min-h-[250px] w-full border border-gray-300 rounder-md p-4 mt-2'
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className='w-full'>
            <div className='flex gap-2 mb-2'>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded border text-sm font-medium ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
                >
                    bold
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded border text-sm font-medium ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
                >
                    italic
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`px-3 py-1 rounded border text-sm font-medium ${editor.isActive('strike') ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
                >
                    strike
                </button>
            </div>
            <EditorContent editor={editor}/>
        </div>
    )
}