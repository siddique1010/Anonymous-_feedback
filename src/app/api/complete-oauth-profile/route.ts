import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = usernameValidation.safeParse(body.username);

  if (!validation.success) {
    return Response.json(
      { success: false, message: validation.error.errors[0]?.message },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const existingUser = await UserModel.findOne({
      username: validation.data,
      _id: { $ne: session.user._id },
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: 'Username is already taken' },
        { status: 409 }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user._id,
      { username: validation.data, needsUsernameSetup: false },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Username saved successfully',
      username: updatedUser.username,
    });
  } catch (error) {
    console.error('Error completing OAuth profile:', error);
    return Response.json(
      { success: false, message: 'Unable to save username' },
      { status: 500 }
    );
  }
}
