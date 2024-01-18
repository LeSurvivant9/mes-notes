import {NextRequest, NextResponse} from 'next/server';
import {promises as fs} from 'fs'
import {v4 as uuidv4} from 'uuid';
import PDFParser from 'pdf2json';

export async function POST(req: NextRequest) {
    const formData: FormData = await req.formData();
    const uploadedFile = formData.get("file");

    if (uploadedFile && uploadedFile instanceof File) {
        const fileName = uuidv4();
        const tempFilePath = `/tmp/${fileName}.pdf`;
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
        await fs.writeFile(tempFilePath, fileBuffer);

        const parsedText: any = await new Promise((resolve) => {
            const pdfParser = new (PDFParser as any)(null, 1);

            pdfParser.on('pdfParser_dataError', (errData: any) => console.log(errData.parserError));
            pdfParser.on('pdfParser_dataReady', () => {
                const text = (pdfParser as any).getRawTextContent();
                const regex = /2\d{7}(\d+\.?\d*)?/g;
                let match;
                const grades = [];

                while ((match = regex.exec(text)) !== null) {
                    const studentNumber = match[0].substr(0, 8);
                    const gradeValue = match[1] ? parseFloat(match[1]) : null;
                    if (gradeValue !== null) {
                        grades.push({student_number: studentNumber, grade_value: gradeValue});
                    }
                }
                resolve(JSON.stringify(grades));
            });

            pdfParser.loadPDF(tempFilePath);
        });

        const response = new NextResponse(parsedText, {
            headers: {'Content-Type': 'application/json'}
        });
        response.headers.set('FileName', fileName);
        return response;
    } else {
        console.log('Uploaded file is not in the expected format or not found.');
        return new NextResponse('File not found or format not supported', {status: 400});
    }
}

