export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: string;            
  status_id: string;      
  status: TaskStatus;      
  title: string;         
  description: string;   
};

export type Column = {
  id: string;          
  title: string;           
};
