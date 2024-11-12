import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../roles/entities/permissions.entity';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async seedRolesAndPermissions() {
    const permissions = ['create', 'read', 'update', 'delete'];
    const roles = [
      { name: 'ADMIN', permissions },
      { name: 'USER', permissions: ['read'] },
    ];

    // Seed permissions
    for (const permName of permissions) {
      let permission = await this.permissionRepository.findOne({
        where: { name: permName },
      });
      if (!permission) {
        permission = this.permissionRepository.create({ name: permName });
        await this.permissionRepository.save(permission);
      }
    }

    // Seed roles with permissions
    for (const roleData of roles) {
      const { name, permissions } = roleData;
      let role = await this.roleRepository.findOne({
        where: { name },
        relations: ['permissions'],
      });

      if (!role) {
        role = this.roleRepository.create({ name });
        await this.roleRepository.save(role);
      }

      const rolePermissions = await this.permissionRepository.find({
        where: permissions.map((perm) => ({ name: perm })),
      });

      role.permissions = rolePermissions;
      await this.roleRepository.save(role);
    }
  }

  async createSampleUser() {
    // Find roles first
    const adminRole = await this.roleRepository.findOne({
      where: { name: 'ADMIN' },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    let user = await this.userRepository.findOne({
      where: { email: 'admin@email.com' },
      relations: ['roles'],
    });

    if (!user) {
      const hashedPassword = await argon2.hash('love&*tech0145');
      user = this.userRepository.create({
        email: 'admin@email.com',
        password: hashedPassword,
        roles: [adminRole],
      });

      await this.userRepository.save(user);
    }
  }
}
