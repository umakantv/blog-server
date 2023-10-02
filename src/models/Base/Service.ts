import { BaseRepo } from "./Repo";

export class BaseService {
  protected repo: BaseRepo;

  constructor(repo: BaseRepo) {
    this.repo = repo;
  }

  async findByIdorFail(id: string) {
    return this.repo.findOne({ _id: id });
  }

  async findOne(options: any, projections?: any) {
    return this.repo.findOne(options, projections);
  }

  async findMany(options?: any, projections?: any) {
    return this.repo.findMany(options, projections);
  }

  async createUnique(options: any) {
    return this.repo.createUnique(options);
  }

  async create(options: any) {
    return this.repo.create(options);
  }

  async updateById(id: string, entityUpdateFields: any, entity?: any) {
    return this.repo.updateEntityById(id, entityUpdateFields, entity);
  }

  async deleteById(id: string) {
    return this.repo.deleteById(id);
  }
}
