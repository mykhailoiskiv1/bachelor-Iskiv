import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 
  
    if (!id) {
      return NextResponse.json({ error: 'ID is missing in URL' }, { status: 400 });
    }
  
    const { title, category, content, seoTitle, seoDescription, seoKeywords } = await req.json();
  
    if (!title || !category || !content) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
  
    try {
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title,
          slug: slugify(title, { lower: true }),
          category,
          content,
          seoTitle,
          seoDescription,
          seoKeywords,
          updatedAt: new Date(),
        },
      });
  
      return NextResponse.json(updatedPost);
    } catch (error) {
      console.error('Update failed:', error);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
  }
  