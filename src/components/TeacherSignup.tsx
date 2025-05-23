
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UserCheck, Save, ArrowRight, BookOpen, School, User, KeyRound, GraduationCap, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  year: z.string().min(1, "Year is required"),
  division: z.string().min(1, "Division is required")
});

const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  subjects: z.array(subjectSchema).min(1, "At least one subject is required")
});

type SubjectFormValues = z.infer<typeof subjectSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface TeacherSignupProps {
  onComplete: (teacherData: SignupFormValues) => void;
  onCancel: () => void;
}

const TeacherSignup: React.FC<TeacherSignupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'form' | 'saving'>('form');
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      subjects: [{ name: '', year: '', division: '' }]
    },
  });

  const addSubject = () => {
    const currentSubjects = form.getValues().subjects || [];
    form.setValue('subjects', [...currentSubjects, { name: '', year: '', division: '' }]);
  };

  const removeSubject = (index: number) => {
    const currentSubjects = form.getValues().subjects;
    if (currentSubjects.length > 1) {
      const newSubjects = currentSubjects.filter((_, i) => i !== index);
      form.setValue('subjects', newSubjects);
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one subject",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (values: SignupFormValues) => {
    setStep('saving');
    
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
        
        // Store in localStorage for demo purposes
        const existingTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
        const newTeacher = {
          ...values,
          id: Date.now().toString(),
        };
        
        localStorage.setItem('teachers', JSON.stringify([...existingTeachers, newTeacher]));
        localStorage.setItem('currentTeacher', JSON.stringify(newTeacher));
        
        toast({
          title: "Registration successful",
          description: "Your teacher account has been created.",
        });
        
        onComplete(values);
      }
    }, 50);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto glass dark:glass-dark border-0 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-900/10 dark:to-purple-900/10" />
      
      <CardHeader className="relative pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
            <School className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Teacher Registration</CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account to start managing classes
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-6 pt-6">
        {step === 'form' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <motion.div 
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="teacher@example.com" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create a strong password" 
                              className="bg-white/50 dark:bg-gray-900/50 pr-10" 
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 pb-2">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Subjects Taught
                    </h3>
                    
                    {form.getValues().subjects.map((_, index) => (
                      <div key={index} className="mb-6 p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium">Subject {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubject(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`subjects.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Subject Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Mathematics" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`subjects.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Year</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                                      <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="FY">FY</SelectItem>
                                    <SelectItem value="SY">SY</SelectItem>
                                    <SelectItem value="TY">TY</SelectItem>
                                    <SelectItem value="LY">LY</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`subjects.${index}.division`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Division</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                                      <SelectValue placeholder="Select Division" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="COMP-A">COMP-A</SelectItem>
                                    <SelectItem value="COMP-B">COMP-B</SelectItem>
                                    <SelectItem value="IT-A">IT-A</SelectItem>
                                    <SelectItem value="IT-B">IT-B</SelectItem>
                                    <SelectItem value="AI-DS-A">AI-DS-A</SelectItem>
                                    <SelectItem value="EXTC-A">EXTC-A</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSubject}
                      className="w-full mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Subject
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800"
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  className="flex-1 bg-white dark:bg-gray-900"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Register & Continue
                </Button>
              </motion.div>
            </form>
          </Form>
        ) : (
          <div className="py-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-6">
                  <UserCheck className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">Creating Your Account</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  We're setting up your teacher profile. This will only take a moment.
                </p>
              </div>
              
              <div className="w-full max-w-md">
                <Progress value={progress} className="h-2" />
                <p className="text-right text-xs text-muted-foreground mt-1">{progress}%</p>
              </div>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherSignup;
