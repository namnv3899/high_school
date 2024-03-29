import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Classroom, ClassSubject, ClassTeacher } from './class.entity';
import {
  CreateClassdto,
  GetOneClassdto,
  SearchClassdto,
  DeleteClassdto,
  AssignClassTeacherDto,
  TimetableDto,
  GetClassTeacherDto,
  ListClassOfTeacherDto,
  classPrimaryOfTeacher,
  UpdateClassdto,
  // UpdateTimetableParam,
} from './class.dto';
import { Subject } from '../students/students.entity';
import { TeacherService } from '../teacher/teacher.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(ClassSubject)
    private readonly classSubjectRepository: Repository<ClassSubject>,
    @InjectRepository(ClassTeacher)
    private readonly classTeacherRepository: Repository<ClassTeacher>,
    @InjectRepository(Subject)
    private readonly SubjectRepository: Repository<Subject>,
    private readonly teacherService: TeacherService,
  ) {}

  public async createClass(createClassdto: CreateClassdto) {
    try {
      const classroom = new Classroom();
      classroom.name = createClassdto.name;
      classroom.location = createClassdto.location;
      classroom.startYear = createClassdto.startYear;
      classroom.endYear = createClassdto.endYear;

      const rs = await this.classroomRepository.save(classroom);
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async createTimetable(timetableDto: TimetableDto) {
    console.log('timetableDto:', timetableDto);

    let result: any = [];
    try {
      const classSubject = new ClassSubject();
      const classroom = await this.classroomRepository.findOne({
        where: { id: timetableDto.classId },
      });
      classSubject.lesson = timetableDto.lesson;
      classSubject.classId = classroom.id;
      classSubject.monday = timetableDto.monday;
      classSubject.tuesday = timetableDto.tuesday;
      classSubject.wednesday = timetableDto.wednesday;
      classSubject.thursday = timetableDto.thursday;
      classSubject.friday = timetableDto.friday;
      classSubject.saturday = timetableDto.saturday;
      const rs = await this.classSubjectRepository.save(classSubject);

      result = await result.concat(rs);

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async listClassOfTeacher(data: ListClassOfTeacherDto) {
    const { teacherId } = data;
    const rs = await this.classroomRepository
      .createQueryBuilder('classroom')
      .innerJoin('classroom.classTeachers', 'classTeachers')
      .innerJoin('classTeachers.teacher', 'teacher')
      .where('teacher.id=:teacherId', { teacherId })
      .getMany();
    return rs;
  }

  public async getTimetableOfTeacher(data: any) {
    const { classId } = data;
    const classTeacher = await this.classSubjectRepository.find({
      where: [{ monday: 'Ngữ văn' }, {}, {}, {}, {}],
    });
    return classTeacher;
  }

  public async getTimetable(data: any) {
    const { classId } = data;
    const classTeacher = await this.classSubjectRepository.find({
      where: { classId },
    });
    return classTeacher;
  }

  public async getSubjects() {
    return await this.SubjectRepository.find();
  }

  public async assignClassTeacher(
    assignClassTeacherDto: AssignClassTeacherDto,
  ) {
    let result: any = [];
    try {
      console.log(111, assignClassTeacherDto);

      for (const index in assignClassTeacherDto) {
        if (!assignClassTeacherDto[index].teacherId) {
          return result;
        }
        const classTeacher = new ClassTeacher();
        const classroom = await this.classroomRepository.findOne({
          where: { id: assignClassTeacherDto[index].classId },
        });

        const teacher = await this.teacherService.findOneTeacher({
          id: assignClassTeacherDto[index].teacherId,
        });

        console.log(222, teacher);
        classTeacher.classId = assignClassTeacherDto[index].classId;
        classTeacher.subject = index;
        classTeacher.classroom = classroom;
        classTeacher.teacher = teacher;
        const rs = await this.classTeacherRepository.save(classTeacher);
        console.log(333, rs);
        result = await result.concat(rs);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async updateClassTeacher(data: any) {
    let result: any;
    try {
      for (const index in data) {
        // console.log('INsexfd:', index);
        const classTeacher = await this.classTeacherRepository.findOne({
          where: { id: data[index].classteacherId },
        });

        const teacher = await this.teacherService.findOneTeacher({
          id: data[index].teacherId,
        });

        classTeacher.teacher = teacher;
        const rs = await this.classTeacherRepository.save(classTeacher);
        result = await result.concat(rs);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async updateTimetable(data: any) {
    const { classId, lesson } = data;
    const classSubject = await this.classSubjectRepository.findOne({
      where: { classId, lesson },
    });

    classSubject.monday = data.monday;
    classSubject.tuesday = data.tuesday;
    classSubject.wednesday = data.wednesday;
    classSubject.thursday = data.thursday;
    classSubject.friday = data.friday;
    classSubject.saturday = data.saturday;

    const rs = await this.classSubjectRepository.save(classSubject);
    return rs;
  }

  public async getClassTeacher(data: GetClassTeacherDto) {
    const { classId } = data;

    const classTeacher = await this.classTeacherRepository.find({
      where: { classId },
    });
    return classTeacher;
  }

  public async searchClass(searchClassdto: SearchClassdto) {
    const filter = searchClassdto.name || '';

    try {
      const [result, total] = await this.classroomRepository.findAndCount({
        where: { name: ILike(`%${filter}%`) },
        order: { name: 'ASC' },
      });

      return {
        data: result,
        count: total,
      };
    } catch (error) {
      throw error;
    }
  }

  public async classPrimaryOfTeacher(getOneClassdto: classPrimaryOfTeacher) {
    const { teacherId } = getOneClassdto;
    try {
      const rs = await this.classroomRepository
        .createQueryBuilder('classroom')
        .innerJoin('classroom.classTeachers', 'classTeachers')
        .innerJoin('classTeachers.teacher', 'teacher')
        .where('teacher.id=:teacherId', { teacherId })
        .andWhere('classTeachers.subject=:subject', { subject: 'chuNhiem' })
        .getOne();
      return rs;
    } catch (error) {
      throw error;
    }
  }
  public async findOneClass(getOneClassdto: GetOneClassdto) {
    const { id } = getOneClassdto;
    try {
      if (!id) {
        const rs = await this.classroomRepository.findOne({
          where: { id },
        });
        return rs;
      }

      const rs = await this.classroomRepository.findOne({ where: { id } });
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async updateClass(id: number, updateClassdto: UpdateClassdto) {
    const { name, location, startYear, endYear } = updateClassdto;
    try {
      const classrom = await this.classroomRepository.findOne({
        where: { id },
      });
      classrom.name = name;
      classrom.location = location;
      classrom.startYear = startYear;
      classrom.endYear = endYear;

      const rs = await this.classroomRepository.save(classrom);
      return rs;
    } catch (error) {
      throw error;
    }
  }
  public async removeClass(deleteClassdto: DeleteClassdto) {
    try {
      const { id } = deleteClassdto;

      const rs = await this.classroomRepository.delete(id);
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
