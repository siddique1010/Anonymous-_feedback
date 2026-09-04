// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]/options';
// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';
// import { User } from 'next-auth';

// export async function POST(request: Request) {
//   // Connect to the database
//   await dbConnect();

//   const session = await getServerSession(authOptions);
//   const user: User = session?.user;
//   if (!session || !session.user) {
//     return Response.json(
//       { success: false, message: 'Not authenticated' },
//       { status: 401 }
//     );
//   }

//   const userId = user._id;
//   const { acceptMessages } = await request.json();

//   try {
//     // Update the user's message acceptance status
//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       { isAcceptingMessages: acceptMessages },
//       { new: true }
//     );

//     if (!updatedUser) {
//       // User not found
//       return Response.json(
//         {
//           success: false,
//           message: 'Unable to find user to update message acceptance status',
//         },
//         { status: 404 }
//       );
//     }

//     // Successfully updated message acceptance status
//     return Response.json(
//       {
//         success: true,
//         message: 'Message acceptance status updated successfully',
//         updatedUser,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error updating message acceptance status:', error);
//     return Response.json(
//       { success: false, message: 'Error updating message acceptance status' },
//       { status: 500 }
//     );
//   }
// }


// export async function GET(request: Request) {
//   // Connect to the database
//   await dbConnect();

//   // Get the user session
//   const session = await getServerSession(authOptions);
//   const user = session?.user;

//   // Check if the user is authenticated
//   if (!session || !user) {
//     return Response.json(
//       { success: false, message: 'Not authenticated' },
//       { status: 401 }
//     );
//   }

//   try {
//     // Retrieve the user from the database using the ID
//     const foundUser = await UserModel.findById(user._id);

//     if (!foundUser) {
//       // User not found
//       return Response.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Return the user's message acceptance status
//     return Response.json(
//       {
//         success: true,
//         isAcceptingMessages: foundUser.isAcceptingMessages,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error retrieving message acceptance status:', error);
//     return Response.json(
//       { success: false, message: 'Error retrieving message acceptance status' },
//       { status: 500 }
//     );
//   }
// }


import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get authenticated session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: 'Not authenticated',
        },
        { status: 401 }
      );
    }

    const user: User = session.user;

    // Make sure the authenticated user has an ID
    if (!user._id) {
      return Response.json(
        {
          success: false,
          message: 'Invalid user session',
        },
        { status: 401 }
      );
    }

    /*
     * Validate request payload
     *
     * Only this payload is allowed:
     * {
     *   "acceptMessages": true
     * }
     */
    const body = await request.json();

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body) ||
      Object.keys(body).length !== 1 ||
      !Object.prototype.hasOwnProperty.call(body, 'acceptMessages') ||
      typeof body.acceptMessages !== 'boolean'
    ) {
      return Response.json(
        {
          success: false,
          message: 'Invalid payload. Only acceptMessages (boolean) is allowed.',
        },
        { status: 400 }
      );
    }

    const { acceptMessages } = body;

    /*
     * IMPORTANT:
     * Use the authenticated user's ID from the session.
     * Do NOT accept userId/UUID from the client.
     */
    const userId = user._id;

    // Update only the authenticated user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isAcceptingMessages: acceptMessages,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    /*
     * IMPORTANT:
     * Do NOT return the complete MongoDB user document.
     * It may contain password, verifyCode, verifyCodeExpiry, etc.
     */
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          isAcceptingMessages: updatedUser.isAcceptingMessages,
          isVerified: updatedUser.isVerified,
          needsUsernameSetup: updatedUser.needsUsernameSetup,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating message acceptance status:', error);

    return Response.json(
      {
        success: false,
        message: 'Error updating message acceptance status',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Check authentication
    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: 'Not authenticated',
        },
        { status: 401 }
      );
    }

    if (!user._id) {
      return Response.json(
        {
          success: false,
          message: 'Invalid user session',
        },
        { status: 401 }
      );
    }

    // Retrieve only the authenticated user's record
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Return only the required field
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);

    return Response.json(
      {
        success: false,
        message: 'Error retrieving message acceptance status',
      },
      { status: 500 }
    );
  }
}