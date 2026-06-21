import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
    let service: MailService;
    const mockSendMail = jest.fn();
    const mockTransporter = {
        sendMail: mockSendMail,
    };

  
    const testRecipientEmail = 'recipient@example.com';
    const testShareLink = 'http://localhost:5173/shared/token123';

    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(async () => {
        jest.clearAllMocks();

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
        jest.spyOn(console, 'log').mockImplementation(() => {});

        (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
        (nodemailer.createTestAccount as jest.Mock).mockResolvedValue({
            user: 'test@ethereal.email',
            pass: 'testpass123',
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [MailService],
        }).compile();

        service = module.get<MailService>(MailService);
        
   
        await service.onModuleInit();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendShareLink', () => {
        it('sends email successfully', async () => {
            mockSendMail.mockResolvedValue({
                messageId: 'test-message-id',
                response: '250 Message accepted',
            });

            await expect(
                service.sendShareLink(testRecipientEmail, testShareLink)
            ).resolves.not.toThrow();

            expect(mockSendMail).toHaveBeenCalled();
        });

        it('handles email errors', async () => {
            mockSendMail.mockRejectedValueOnce(new Error('SMTP error'));

           
            await expect(
                service.sendShareLink(testRecipientEmail, testShareLink)
            ).rejects.toThrow('SMTP error');

            
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });
});