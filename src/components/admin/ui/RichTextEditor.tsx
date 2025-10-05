'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const editor: Editor | null = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        horizontalRule: false,
        codeBlock: false,
        code: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['paragraph'],
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
      handleKeyDown: (view, event) => {
        // Tab key for indentation
        if (event.key === 'Tab' && editor) {
          event.preventDefault();
          if (event.shiftKey) {
            // Shift+Tab: outdent (lift list item)
            return editor.chain().focus().liftListItem('listItem').run();
          } else {
            // Tab: indent (sink list item or add spaces)
            return editor.chain().focus().sinkListItem('listItem').run() ||
                   editor.chain().focus().insertContent('\u00A0\u00A0\u00A0\u00A0').run();
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const colors = ['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
  const highlights = ['#fef3c7', '#fecaca', '#fed7aa', '#d9f99d', '#bfdbfe', '#ddd6fe', '#fbcfe8'];

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        {/* 기본 서식 */}
        <div className={styles.toolbarRow}>
          <div className={styles.toolbarGroup}>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.active : ''}`}
              title="굵게 (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.active : ''}`}
              title="기울임 (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`${styles.toolbarBtn} ${editor.isActive('underline') ? styles.active : ''}`}
              title="밑줄 (Ctrl+U)"
            >
              <u style={{ textDecoration: 'underline' }}>U</u>
            </button>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              onClick={setLink}
              className={`${styles.toolbarBtn} ${editor.isActive('link') ? styles.active : ''}`}
              title="링크 추가"
            >
              🔗
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`${styles.toolbarBtn} ${editor.isActive('bulletList') ? styles.active : ''}`}
              title="목록"
            >
              •
            </button>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="실행 취소 (Ctrl+Z)"
              className={styles.toolbarBtn}
            >
              ↶
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="다시 실행 (Ctrl+Y)"
              className={styles.toolbarBtn}
            >
              ↷
            </button>
          </div>

          <div className={styles.divider}></div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`${styles.toolbarBtn} ${showAdvanced ? styles.active : ''}`}
            title="고급 옵션"
          >
            ⋯
          </button>
        </div>

        {/* 고급 옵션 */}
        {showAdvanced && (
          <div className={styles.toolbarRow}>
            <div className={styles.toolbarGroup}>
              <div className={styles.colorPickerWrapper}>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={styles.toolbarBtn}
                  title="텍스트 색상"
                >
                  <span className={styles.colorIconWrapper}>
                    <span className={styles.colorIcon}>A</span>
                    <span
                      className={styles.colorBar}
                      style={{ background: editor.getAttributes('textStyle').color || '#000000' }}
                    />
                  </span>
                </button>
                {showColorPicker && (
                  <div className={styles.colorPalette}>
                    <div className={styles.colorGrid}>
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowColorPicker(false);
                          }}
                          className={styles.colorSwatch}
                          style={{ background: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowColorPicker(false);
                      }}
                      className={styles.colorReset}
                    >
                      기본 색상
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.colorPickerWrapper}>
                <button
                  type="button"
                  onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                  className={styles.toolbarBtn}
                  title="형광펜"
                >
                  🖍️
                </button>
                {showHighlightPicker && (
                  <div className={styles.colorPalette}>
                    <div className={styles.colorGrid}>
                      {highlights.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setHighlight({ color }).run();
                            setShowHighlightPicker(false);
                          }}
                          className={styles.colorSwatch}
                          style={{ background: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().unsetHighlight().run();
                        setShowHighlightPicker(false);
                      }}
                      className={styles.colorReset}
                    >
                      하이라이트 제거
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.toolbarGroup}>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'left' }) ? styles.active : ''}`}
                title="왼쪽 정렬"
              >
                <span style={{ fontSize: '18px' }}>⬅</span>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'center' }) ? styles.active : ''}`}
                title="가운데 정렬"
              >
                <span style={{ fontSize: '18px' }}>↔</span>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'right' }) ? styles.active : ''}`}
                title="오른쪽 정렬"
              >
                <span style={{ fontSize: '18px' }}>➡</span>
              </button>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.toolbarGroup}>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${styles.toolbarBtn} ${editor.isActive('orderedList') ? styles.active : ''}`}
                title="번호 목록"
              >
                1.
              </button>
            </div>
          </div>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
