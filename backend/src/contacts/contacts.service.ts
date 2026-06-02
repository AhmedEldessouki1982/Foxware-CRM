import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactsResponseDto } from './dto/contacts-reponse.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new contact, ensuring that the email is unique among non-deleted contacts
  async create(
    createContactDto: CreateContactDto,
  ): Promise<ContactsResponseDto> {
    const existingContact = await this.prisma.contact.findFirst({
      where: {
        email: createContactDto.email,
        deletedAt: null,
      },
    });

    if (existingContact) {
      throw new ConflictException('A contact with this email already exists');
    }

    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  // Retrieve all contacts that have not been marked as deleted
  async findAll(): Promise<ContactsResponseDto[]> {
    return this.prisma.contact.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  // Retrieve a single contact by its ID, ensuring it has not been marked as deleted
  async findOne(id: string): Promise<ContactsResponseDto | null> {
    return this.prisma.contact.findUnique({
      where: { id },
      include: {},
    });
  }

  // Update an existing contact
  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<ContactsResponseDto> {
    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  // Soft delete a contact by setting the deletedAt field to the current date and time
  async remove(id: string): Promise<ContactsResponseDto> {
    return this.prisma.contact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
