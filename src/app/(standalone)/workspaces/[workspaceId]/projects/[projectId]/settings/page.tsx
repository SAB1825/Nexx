import { getCurrent } from '@/features/auth/actions'
import { getProject } from '@/features/projects/actions';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { redirect } from 'next/navigation';
import React from 'react'

interface ProjectIdSettingPageProps {
    params: {
        projectId: string;
    }
}
const ProjectIdSettingPage = async ({params}: ProjectIdSettingPageProps) => {
    const user = await getCurrent();
    if(!user) {
        redirect("/sign-in")
    }
    const initialValues = await getProject({
        projectId: params.projectId,
    });
  return (
    <div><EditProjectForm initialValues={initialValues} /></div>
  )
}

export default ProjectIdSettingPage