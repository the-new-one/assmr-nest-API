import { Account } from 'src/entity/signup/signup.entity';
import { Repository } from 'typeorm';

async function checkEmailExists(
  accountEntity: Repository<Account>,
  email: string,
) {
  const user = await accountEntity.findOne({
    select: {
      email: true,
    },
    where: {
      email,
    },
  });

  return user;
}

export { checkEmailExists };
