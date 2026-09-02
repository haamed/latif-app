import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PeopleService {
    constructor(private prisma: PrismaService) { }

    create(createPersonDto: CreatePersonDto) {
        return this.prisma.person.create({ data: createPersonDto });
    }

    findAll() {
        return this.prisma.person.findMany({ orderBy: { lastName: 'asc' } });
    }

    findOne(id: number) {
        return this.prisma.person.findUnique({ where: { id } });
    }

    update(id: number, updatePersonDto: UpdatePersonDto) {
        return this.prisma.person.update({
            where: { id },
            data: updatePersonDto,
        });
    }

    remove(id: number) {
        return this.prisma.person.delete({ where: { id } });
    }
}
