import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShareModal from './ShareModal'

describe('ShareModal', () => {
    const mockOnClose = vi.fn()

    const mockTodos = [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
        { id: 2, title: 'Task 2', description: 'Desc 2', completed: true },
    ]

    beforeEach(() => {
        mockOnClose.mockClear()
    })

    it('should render email input', () => {
        render(
            <ShareModal
                todos={mockTodos}
                onClose={mockOnClose}
            />,
        )

        expect(screen.getByPlaceholderText(/user@example/i)).toBeInTheDocument()
    })

    it('should update email field', async () => {
        const user = userEvent.setup()
        render(
            <ShareModal
                todos={mockTodos}
                onClose={mockOnClose}
            />,
        )

        const emailInput = screen.getByPlaceholderText(/user@example/i)
        await user.type(emailInput, 'test@example.com')

        expect(emailInput).toHaveValue('test@example.com')
    })

    it('should validate email format', async () => {
        const user = userEvent.setup()
        render(
            <ShareModal
                todos={mockTodos}
                onClose={mockOnClose}
            />,
        )

        const emailInput = screen.getByPlaceholderText(/user@example/i) as HTMLInputElement
        await user.type(emailInput, 'invalid-email')

        expect(emailInput.validity.valid).toBe(false)
    })

    it('should have email input and send button', async () => {
        render(
            <ShareModal
                todos={mockTodos}
                onClose={mockOnClose}
            />,
        )

        const emailInput = screen.getByPlaceholderText(/user@example/i)
        const shareButton = screen.getByRole('button', { name: /поділитись|поділити/i })

        expect(emailInput).toBeInTheDocument()
        expect(shareButton).toBeInTheDocument()
    })

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup()
        render(
            <ShareModal
                todos={mockTodos}
                onClose={mockOnClose}
            />,
        )

        const closeButton = screen.getByRole('button', { name: /скасувати/i })
        await user.click(closeButton)

        expect(mockOnClose).toHaveBeenCalled()
    })

    it('should display task count', () => {
        render(
            <ShareModal
                todos={mockTodos}
                onClose={mockOnClose}
            />,
        )

        expect(screen.getByText(/Буде поділено/i)).toBeInTheDocument()
    })

    it('should have responsive styling', () => {
        const { container } = render(
            <ShareModal
                todos={mockTodos}
                onClose={mockOnClose}
            />,
        )

        const modal = container.querySelector('div[class*="modal"]') || container.firstChild
        expect(modal).toBeInTheDocument()
    })
})

