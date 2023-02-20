import { useState } from 'react';
import { Button } from '../components/modular/forms/buttons/Button';
import { PageTitle } from '../components/modular/html/PageTitle';
import { Modal } from '../components/modular/overlays/Modal';

export default function Test() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <PageTitle title="Test Page" />
      <div className="h-screen w-screen flex items-center justify-center">
        <Button btnLabel={'Primary'} shadow />
      </div>

      {/* <Modal
        title="Modal title"
        subtitle="This is a subtitle"
        isOpen={isOpen}
        size="xl"
        child={<></>}
        setIsOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        onConfirm={() => null}
      />
      <div className="flex items-center justify-center h-[100vh] gap-3">
        <Button btnLabel="open modal" strong shadow onClick={() => setIsOpen(true)} />
      </div> */}
    </>
  );
}
