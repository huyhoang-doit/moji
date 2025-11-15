import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  username: z
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(20, 'Tên đăng nhập không được vượt quá 20 ký tự')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
    ),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
    )
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0 border-border'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-6'>
              {/* header */}
              <div className='flex flex-col items-center text-center gap-2'>
                <a href='/' className='mx-auto block w-fit text-center'>
                  <img src='/logo.svg' alt='logo' />
                </a>
                <h1 className='text-2xl font-bold'> Tạo tài khoản MoJi</h1>
                <p className='text-muted-foreground text-balance'>
                  Chào mừng bạn! Hãy đăng ký để bắt đầu hành trình
                </p>
              </div>
              {/* Họ và tên */}
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='block text-sm'>
                    Họ
                  </Label>
                  <Input
                    id='lastName'
                    type='text'
                    placeholder='Nhập họ'
                    {...register('lastName')}
                  />
                  {/* todo: error message */}
                  {errors.lastName && (
                    <p className='text-destructive text-sm'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='firstName' className='block text-sm'>
                    Tên
                  </Label>
                  <Input
                    id='firstName'
                    type='text'
                    placeholder='Nhập tên'
                    {...register('firstName')}
                  />
                  {/* todo: error message */}
                  {errors.firstName && (
                    <p className='text-destructive text-sm'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
              {/* username */}
              <div className='flex flex-col gap-3'>
                <Label htmlFor='username' className='block text-sm'>
                  Tên đăng nhập
                </Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='Nhập tên đăng nhập'
                  {...register('username')}
                />
                {/* todo: error message */}
                {errors.username && (
                  <p className='text-destructive text-sm'>
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* email */}
              <div className='flex flex-col gap-3'>
                <Label htmlFor='email' className='block text-sm'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='@Nhập email'
                  {...register('email')}
                />
                {/* todo: error message */}
                {errors.email && (
                  <p className='text-destructive text-sm'>
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* password */}
              <div className='flex flex-col gap-3'>
                <Label htmlFor='password' className='block text-sm'>
                  Mật khẩu
                </Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Nhập mật khẩu'
                  {...register('password')}
                />
                {/* todo: error message */}
                {errors.password && (
                  <p className='text-destructive text-sm'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* nút đăng ký */}
              <Button
                type='submit'
                className='mt-4 w-full'
                disabled={isSubmitting}
              >
                Tạo tài khoản
              </Button>
              <div className='text-center text-sm'>
                Đã có tài khoản?{' '}
                <a href='/signin' className='text-primary hover:underline'>
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <img
              src='/placeholderSignUp.png'
              alt='Image'
              className='absolute top-1/2 -translate-y-1/2 object-cover'
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className='text-xs text-balance px-6 text-center *:[a]:hover:text-primary *:[a]:hover:underline *:[a]:hover:underline-offset-4'>
        Bằng cách tiếp tục, bạn đồng ý với <a href='#'>Điều khoản dịch vụ</a> và{' '}
        <a href='#'>Chính sách bảo mật</a> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
