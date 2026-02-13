import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json({ tasks: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        userId: 'dev-user', // Replace with real auth
        title: body.title,
        description: body.description,
        priority: body.priority,
        owner: body.owner,
        column: body.column,
        impact: body.impact,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Task create error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
