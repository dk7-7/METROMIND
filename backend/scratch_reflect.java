import java.lang.reflect.Method;

public class scratch_reflect {
    public static void main(String[] args) throws Exception {
        scratch_reflect obj = new scratch_reflect();
        
        // Test case 1: Invoke 1-param method with 2 arguments
        Method m1 = scratch_reflect.class.getMethod("m1", String.class);
        try {
            m1.invoke(obj, "hello", "world");
        } catch (Exception e) {
            System.out.println("m1 with 2 args: " + e.getClass().getName() + " -> " + e.getMessage());
        }
        
        // Test case 2: Invoke 2-param method with 1 argument
        Method m2 = scratch_reflect.class.getMethod("m2", String.class, Integer.class);
        try {
            m2.invoke(obj, "hello");
        } catch (Exception e) {
            System.out.println("m2 with 1 arg: " + e.getClass().getName() + " -> " + e.getMessage());
        }

        // Test case 3: Invoke 1-param method with wrong argument type
        try {
            m1.invoke(obj, 123);
        } catch (Exception e) {
            System.out.println("m1 with wrong type: " + e.getClass().getName() + " -> " + e.getMessage());
        }
    }
    
    public void m1(String s) {}
    public void m2(String s, Integer i) {}
}
